**OpenZFS** combines the volume manager and the filesystem. A **pool** (`zpool`) is built from **vdevs**, and vdevs are built from disks; **datasets** (`zfs`) are the filesystems and volumes that live inside a pool.

> ⚠️ Redundancy lives at the **vdev** level, not the pool level. Lose one vdev and you lose the whole pool, however healthy the others are.

## 📦 Pool Basics

```bash
# create a pool from a single disk (no redundancy)
zpool create mypool /dev/disk/by-id/<disk>

# a two-disk mirror, 4K-aligned
zpool create -o ashift=12 mypool mirror /dev/disk/by-id/<disk1> /dev/disk/by-id/<disk2>

# raidz2 across six disks
zpool create -o ashift=12 tank raidz2 <disk1> <disk2> <disk3> <disk4> <disk5> <disk6>

# mount the pool somewhere other than /<poolname>
zpool create -m /srv/data mypool <disk>

# add another vdev (this widens the pool, it does not add redundancy)
zpool add mypool mirror <disk3> <disk4>

# add a hot spare, a read cache (L2ARC) and a separate intent log
zpool add mypool spare <disk>
zpool add mypool cache <ssd>
zpool add mypool log mirror <ssd1> <ssd2>

# destroy a pool — irreversible
zpool destroy mypool
```

## 🔍 Inspecting

```bash
# pools, their size and health
zpool list

# per-vdev breakdown
zpool list -v

# layout, errors and any running scrub or resilver
zpool status mypool

# only the pools that need attention
zpool status -x

# live throughput, refreshed every 5 seconds
zpool iostat -v 5

# every property of the pool
zpool get all mypool

# what has been done to this pool, ever
zpool history mypool
```

## 🛠 Vdev Types

| Vdev type | Description                         | RAID equivalent     | Min. disks | Survives                       |
|-----------|-------------------------------------|---------------------|------------|--------------------------------|
| `stripe`  | Data spread across disks, no parity | RAID 0              | 1          | nothing                        |
| `mirror`  | A full copy on every disk           | RAID 1              | 2          | all but one disk               |
| `raidz1`  | Single parity                       | RAID 5              | 3          | 1 disk                         |
| `raidz2`  | Double parity                       | RAID 6              | 4          | 2 disks                        |
| `raidz3`  | Triple parity                       | — (no common level) | 5          | 3 disks                        |
| `dRAID`   | Distributed parity with spare space | —                   | 6+         | as configured, rebuilds faster |

Support vdevs: `cache` (L2ARC read cache), `log` (SLOG, for synchronous writes), `special` (metadata and small blocks), `spare` (hot spare).

## 🩺 Health & Maintenance

```bash
# verify every block against its checksum
zpool scrub mypool

# stop or pause a running scrub
zpool scrub -s mypool
zpool scrub -p mypool

# forget errors that have been dealt with
zpool clear mypool

# swap a failing disk for a new one
zpool replace mypool <old-disk> <new-disk>

# turn a single disk into a mirror, or break one up
zpool attach mypool <existing-disk> <new-disk>
zpool detach mypool <disk>

# take a disk out of service and bring it back
zpool offline mypool <disk>
zpool online mypool <disk>

# tell the SSDs which blocks are free
zpool trim mypool

# enable the on-disk features of a newer OpenZFS release
zpool upgrade mypool
```

> 💡 Scrub monthly on consumer disks, weekly if the data matters. `zpool status` reports what the last scrub found.

## 📤 Import & Export

```bash
# release a pool so it can be moved to another machine
zpool export mypool

# list the pools that could be imported
zpool import

# import by name, preferring the stable device names
zpool import -d /dev/disk/by-id mypool

# import every pool it can find
zpool import -a

# import a pool that was not exported cleanly
zpool import -f mypool

# import under a different name, or under an alternate root
zpool import mypool newname
zpool import -R /mnt mypool
```

## ⚙️ Pool Properties

```bash
# trim automatically as blocks are freed
zpool set autotrim=on mypool

# grow the pool when the underlying disks grow
zpool set autoexpand=on mypool

# replace a failed disk with a spare automatically
zpool set autoreplace=on mypool

# what to do when the pool faults: wait | continue | panic
zpool set failmode=continue mypool

# read one property
zpool get health,capacity,fragmentation mypool
```

## 📁 Datasets & Filesystems

```bash
# create a dataset
zfs create mypool/data

# create a nested dataset, making the parents as needed
zfs create -p mypool/data/projects/web

# create a block device (zvol) for a VM or iSCSI target
zfs create -V 50G mypool/vm-disk

# list datasets, snapshots and volumes
zfs list
zfs list -t all -r mypool

# common properties
zfs set compression=lz4 mypool/data
zfs set quota=100G mypool/data
zfs set reservation=10G mypool/data
zfs set atime=off mypool/data
zfs set recordsize=1M mypool/media

# read properties, including where they were inherited from
zfs get -r compression mypool
zfs get all mypool/data

# mount, unmount, and destroy
zfs mount mypool/data
zfs unmount mypool/data
zfs destroy -r mypool/data
```

## 📸 Snapshots & Replication

```bash
# take a snapshot (instant, and free until the data diverges)
zfs snapshot mypool/data@2026-08-22

# snapshot a dataset and everything under it
zfs snapshot -r mypool/data@nightly

# list snapshots and what they cost
zfs list -t snapshot -o name,used,refer

# go back in time — discards everything written since
zfs rollback mypool/data@2026-08-22

# read a single file out of a snapshot instead
ls /mypool/data/.zfs/snapshot/2026-08-22/

# a writable copy of a snapshot
zfs clone mypool/data@2026-08-22 mypool/data-copy

# send a full snapshot to another machine
zfs send mypool/data@snap1 | ssh user@host zfs receive backup/data

# send only what changed since the previous snapshot
zfs send -i mypool/data@snap1 mypool/data@snap2 | ssh user@host zfs receive backup/data

# delete a snapshot
zfs destroy mypool/data@snap1
```

## 🧠 Tips & Best Practices

- Address disks by `/dev/disk/by-id/...`, never `/dev/sdX` — kernel names move between boots.
- Set `ashift=12` at creation time for any modern drive; it cannot be changed afterwards.
- Give ZFS whole disks, not partitions, so it can manage the write cache itself.
- Keep pools below ~80% full — performance falls off a cliff above that, and fragmentation is permanent.
- Use ECC RAM where you can: ZFS trusts what is in memory.
- Do not mix vdev types or widths in one pool; the pool is only as good as its weakest vdev.
- A snapshot is not a backup — replicate it somewhere else with `zfs send`.

## 📚 Resources

- [OpenZFS documentation](https://openzfs.github.io/openzfs-docs/)
- [`zpool` manual page](https://openzfs.github.io/openzfs-docs/man/master/8/zpool.8.html)
- [`zfs` manual page](https://openzfs.github.io/openzfs-docs/man/master/8/zfs.8.html)
- [Workload tuning guide](https://openzfs.github.io/openzfs-docs/Performance%20and%20Tuning/Workload%20Tuning.html)
