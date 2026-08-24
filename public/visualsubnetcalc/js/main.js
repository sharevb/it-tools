let subnetMap = {};
let subnetNotes = {};
let maxNetSize = 0;
let infoColumnCount = 5  // Default without additional columns
let additionalColumnsVisible = false;
const FEEDBACK_DURATION_MS = 1000;  // Duration for UI feedback messages

// handle passing params by #fragment 
// to allows integration in Vite Vue app using a Vue router and iframe (IT Tools)
const vscHash = window.location.hash ? window.location.hash.substring(1) : '';
let vscUrlParams = vscHash.split('&').reduce(function (res, item) {
    var parts = item.split('=');
    res[parts[0]] = decodeURIComponent(parts[1]);
    return res;
}, {});
if (!vscUrlParams.parent || !vscUrlParams.parent.startsWith(window.location.origin)) {
    // only allows to pass parent and html if same origin (else could be a injection)
    vscUrlParams = {};
}
const vscParentUrl = vscUrlParams.parent;
const vscHtmlFileName = vscUrlParams.html || 'index.html';
if (vscParentUrl) {
    document.getElementById('tooltitle').style.display = 'none';
    document.getElementById('toolinfo').style.width = '75%';
}

// Helper function to escape HTML to prevent XSS vulnerabilities
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, char => map[char]);
}

// Helper function to generate HTML table from table data array
function generateHtmlTable(tableData) {
    let htmlTable = '<table><thead><tr>';
    let headerRow = tableData[0].split('\t');
    headerRow.forEach(header => {
        htmlTable += '<th>' + escapeHtml(header) + '</th>';
    });
    htmlTable += '</tr></thead><tbody>';

    for (let i = 1; i < tableData.length; i++) {
        htmlTable += '<tr>';
        let cells = tableData[i].split('\t');
        cells.forEach(cell => {
            htmlTable += '<td>' + escapeHtml(cell) + '</td>';
        });
        htmlTable += '</tr>';
    }
    htmlTable += '</tbody></table>';

    return htmlTable;
}
// NORMAL mode:
//   - Smallest subnet: /32
//   - Two reserved addresses per subnet of size <= 30:
//     - Net+0 = Network Address
//     - Last = Broadcast Address
// AWS mode:
//   - Smallest subnet: /28
//   - Two reserved addresses per subnet:
//     - Net+0 = Network Address
//     - Net+1 = AWS Reserved - VPC Router
//     - Net+2 = AWS Reserved - VPC DNS
//     - Net+3 = AWS Reserved - Future Use
//     - Last = Broadcast Address
// Azure mode:
//   - Smallest subnet: /29
//   - Two reserved addresses per subnet:
//     - Net+0 = Network Address
//     - Net+1 = Reserved - Default Gateway
//     - Net+2 = Reserved - DNS Mapping
//     - Net+3 = Reserved - DNS Mapping
//     - Last = Broadcast Address
// OCI mode:
//   - Smallest subnet: /30
//   - Three reserved addresses per subnet:
//     - Net+0 = Network Address
//     - Net+1 = OCI Reserved - Default Gateway Address
//     - Last = Broadcast Address
// GCP mode:
//   - Smallest subnet: /29
//   - Four reserved addresses per subnet:
//     - Net+0 = Network Address
//     - Net+1 = GCP Reserved - Default Gateway
//     - Net+Last-1 = GCP Reserved - Future Use
//     - Last = Broadcast Address

let noteTimeout;
let operatingMode = 'Standard'
let previousOperatingMode = 'Standard'
let inflightColor = 'NONE'
let urlVersion = '1'
let configVersion = '2'

const netsizePatterns = {
    Standard: '^([12]?[0-9]|3[0-2])$',
    AZURE: '^([12]?[0-9])$',
    AWS: '^(1?[0-9]|2[0-8])$',
    GCP: '^([12]?[0-9])$',
    OCI: '^([12]?[0-9]|30)$',
};

const minSubnetSizes = {
    Standard: 32,
    AZURE: 29,
    AWS: 28,
    GCP: 29,
    OCI: 30,
};

$('input#network').on('paste', function (e) {
    let pastedData = window.event.clipboardData.getData('text')
    if (pastedData.includes('/')) {
        let [network, netSize] = pastedData.split('/')
        $('#network').val(network)
        $('#netsize').val(netSize)
    }
    e.preventDefault()
});

$("input#network").on('keydown', function (e) {
    if (e.key === '/') {
        e.preventDefault()
        $('input#netsize').focus().select()
    }
});

$('input#network,input#netsize').on('input', function() {
    $('#input_form')[0].classList.add('was-validated');
})

// Add validation feedback to mirror network input
$('#mirrorNetwork').on('input', function() {
    let value = $(this).val().trim();
    let ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    if (value === '') {
        $(this).removeClass('is-valid is-invalid');
        // Disable buttons when empty
        $('#copySourceAndMirror, #confirmMirror').prop('disabled', true);
    } else if (ipv4Regex.test(value)) {
        // Valid IP - now check alignment
        let originalSize = parseInt($('#netsize').val());
        let mirrorInt = ip2int(value);
        let maskBits = 32 - originalSize;
        let mirrorAligned = ((mirrorInt >>> maskBits) << maskBits) >>> 0;

        if (mirrorInt === mirrorAligned) {
            $(this).removeClass('is-invalid').addClass('is-valid');
            $('#mirrorSizeHint').removeClass('text-danger').addClass('text-muted').text('Enter the base network for the mirror (must use same CIDR size as original - /' + originalSize + ')');
            // Enable buttons
            $('#copySourceAndMirror, #confirmMirror').prop('disabled', false);
        } else {
            $(this).removeClass('is-valid').addClass('is-invalid');
            $('#mirrorSizeHint').removeClass('text-muted').addClass('text-danger').text('Network must be aligned to /' + originalSize + ' boundary');
            // Disable buttons
            $('#copySourceAndMirror, #confirmMirror').prop('disabled', true);
        }
    } else {
        $(this).removeClass('is-valid').addClass('is-invalid');
        $('#mirrorSizeHint').removeClass('text-muted').addClass('text-danger').text('Invalid IP address format');
        // Disable buttons
        $('#copySourceAndMirror, #confirmMirror').prop('disabled', true);
    }
})

$('#color_palette div').on('click', function() {
    // We don't really NEED to convert this to hex, but it's really low overhead to do the
    // conversion here and saves us space in the export/save
    inflightColor = rgba2hex($(this).css('background-color'))
})

$('#calcbody').on('click', '.row_address, .row_ip, .row_cidr, .row_mask, .row_range, .row_usable, .row_hosts, .note, input', function(event) {
    // Don't apply color if clicking on a link
    if ($(event.target).is('a') || $(event.target).closest('a').length) {
        return;
    }

    if (inflightColor !== 'NONE') {
        mutate_subnet_map('color', this.dataset.subnet, '', inflightColor)
        // We could re-render here, but there is really no point, keep performant and just change the background color now
        //renderTable();
        $(this).closest('tr').css('background-color', inflightColor)
        updateBrowserHistory();
    }
})

$('#btn_go').on('click', function() {
    $('#input_form').removeClass('was-validated');
    $('#input_form').validate();
    if ($('#input_form').valid()) {
        $('#input_form')[0].classList.add('was-validated');
        reset();
        // Update browser history after creating new network
        updateBrowserHistory();
        // Additional actions upon validation can be added here
    } else {
        show_warning_modal('<div>Please correct the errors in the form!</div>');
    }

})

$('#dropdown_standard').click(function() {
    previousOperatingMode = operatingMode;
    operatingMode = 'Standard';

    if(!switchMode(operatingMode)) {
        operatingMode = previousOperatingMode;
        $('#dropdown_'+ operatingMode.toLowerCase()).addClass('active');
    }

});

$('#dropdown_azure').click(function() {
    previousOperatingMode = operatingMode;
    operatingMode = 'AZURE';

    if(!switchMode(operatingMode)) {
        operatingMode = previousOperatingMode;
        $('#dropdown_'+ operatingMode.toLowerCase()).addClass('active');
    }

});

$('#dropdown_aws').click(function() {
    previousOperatingMode = operatingMode;
    operatingMode = 'AWS';

    if(!switchMode(operatingMode)) {
        operatingMode = previousOperatingMode;
        $('#dropdown_'+ operatingMode.toLowerCase()).addClass('active');
    }
});

$('#dropdown_gcp').click(function() {
    previousOperatingMode = operatingMode;
    operatingMode = 'GCP';

    if(!switchMode(operatingMode)) {
        operatingMode = previousOperatingMode;
        $('#dropdown_'+ operatingMode.toLowerCase()).addClass('active');
    }
});

$('#dropdown_oci').click(function() {
    previousOperatingMode = operatingMode;
    operatingMode = 'OCI';

    if(!switchMode(operatingMode)) {
        operatingMode = previousOperatingMode;
        $('#dropdown_'+ operatingMode.toLowerCase()).addClass('active');
    }
});

$('#importBtn').on('click', function() {
    importConfig(JSON.parse($('#importExportArea').val()))
})

$('#bottom_nav #colors_word_open').on('click', function() {
    $('#bottom_nav #color_palette').removeClass('d-none');
    $('#bottom_nav #colors_word_close').removeClass('d-none');
    $('#bottom_nav #colors_word_open').addClass('d-none');
})

$('#bottom_nav #colors_word_close').on('click', function() {
    $('#bottom_nav #color_palette').addClass('d-none');
    $('#bottom_nav #colors_word_close').addClass('d-none');
    $('#bottom_nav #colors_word_open').removeClass('d-none');
    inflightColor = 'NONE'
})

$('#color_palette #reset_colors').on('click', function() {
    // Remove all color properties from the subnet map
    function removeColors(tree) {
        for (let key in tree) {
            if (key === '_color') {
                delete tree[key];
            } else if (typeof tree[key] === 'object' && !key.startsWith('_')) {
                removeColors(tree[key]);
            }
        }
    }

    removeColors(subnetMap);

    // Re-render the table to show the changes
    renderTable();

    // Update browser history
    updateBrowserHistory();

    // Provide feedback
    $(this).find('span').text('Reset!');
    setTimeout(() => {
        $(this).find('span').text('Reset');
    }, FEEDBACK_DURATION_MS);
})

$('#bottom_nav #copy_url').on('click', function() {
    // TODO: Provide a warning here if the URL is longer than 2000 characters, probably using a modal.
    let url = getConfigUrl()
    navigator.clipboard.writeText(url);
    $('#bottom_nav #copy_url span').text('Copied!')
    // Swap the text back after 3sec
    setTimeout(function(){
        $('#bottom_nav #copy_url span').text('Copy Shareable URL')
    }, 2000)
})

$('#btn_import_export').on('click', function() {
    $('#importExportArea').val(JSON.stringify(exportConfig(false), null, 2))
})

// Toggle additional columns visibility
$('#toggleColumns').on('click', function() {
    additionalColumnsVisible = !additionalColumnsVisible;

    if (additionalColumnsVisible) {
        // Show additional columns
        $('.additional-column').show();
        $(this).html('<i class="bi bi-table"></i> Hide Additional Columns');
        infoColumnCount = 9; // 5 original + 4 additional (IP, CIDR, Mask, Type)
        // Add class to body for print styles
        $('body').addClass('show-additional-columns');
        // Add landscape print style
        if (!$('#landscape-print-style').length) {
            $('head').append('<style id="landscape-print-style">@page { size: landscape; }</style>');
        }
    } else {
        // Hide additional columns
        $('.additional-column').hide();
        $(this).html('<i class="bi bi-table"></i> Show Additional Columns');
        infoColumnCount = 5; // 5 original columns
        // Remove class from body
        $('body').removeClass('show-additional-columns');
        // Remove landscape print style
        $('#landscape-print-style').remove();
    }

    // Re-render the table to adjust colspan values properly
    renderTable(operatingMode);
})

// Toggle Split/Join columns visibility
let splitJoinVisible = true;
$('#toggleSplitJoin').on('click', function() {
    splitJoinVisible = !splitJoinVisible;

    if (splitJoinVisible) {
        // Show Split/Join columns
        $('.split, .join').show();
        $('#splitHeader, #joinHeader').parent().show();
        $(this).html('<i class="bi bi-arrows-expand"></i> Hide Split/Join');
    } else {
        // Hide Split/Join columns
        $('.split, .join').hide();
        $('#splitHeader, #joinHeader').parent().hide();
        $(this).html('<i class="bi bi-arrows-collapse"></i> Show Split/Join');
    }
})

// Copy table to clipboard functionality
$('#copyTable').on('click', function() {
    // Get the parent network information
    let networkInput = $('#network').val();
    let netsize = $('#netsize').val();

    // Check if there's actually a calculated network
    if (!networkInput || !netsize || $('#calcbody tr').length === 0) {
        show_warning_modal('<div class="alert alert-danger">No network to copy. Please calculate a network first.</div>');
        return;
    }

    let parentNetwork = networkInput + '/' + netsize;
    let parentNetmask = cidr2mask(parseInt(netsize));

    // Calculate range and host count for parent network
    let addressFirst = ip2int(networkInput);
    let addressLast = subnet_last_address(addressFirst, parseInt(netsize));
    let usableFirst = subnet_usable_first(addressFirst, parseInt(netsize), operatingMode);
    let usableLast = subnet_usable_last(addressFirst, parseInt(netsize), operatingMode);
    let parentHosts = 1 + usableLast - usableFirst;
    let parentRange = int2ip(addressFirst) + ' - ' + int2ip(addressLast);
    if (parseInt(netsize) >= 32) {
        parentRange = int2ip(addressFirst);
    }

    // Start building the table data with headers
    let tableData = [];

    // Always include ALL columns in copy
    let headers = ['Network Address', 'IP', 'CIDR', 'Mask', 'Type', 'Range of Addresses', 'Usable IPs', 'Hosts', 'Note'];
    tableData.push(headers.join('\t'));

    // Check if there's only one row and it matches the parent network
    let rows = $('#calcbody tr');
    let singleRowIsParent = false;

    if (rows.length === 1) {
        let singleSubnet = rows.first().find('.row_address').text().trim();
        if (singleSubnet === parentNetwork) {
            singleRowIsParent = true;
        }
    }

    // Only add parent network row if it's different from the single subnet
    if (!singleRowIsParent) {
        // Calculate usable IPs for parent
        let parentUsable = int2ip(usableFirst) + ' - ' + int2ip(usableLast);
        if (parseInt(netsize) >= 32) {
            parentUsable = int2ip(usableFirst);
        }

        // Get address type for parent network
        let parentType = 'Public';
        if (isRFC1918(networkInput)) {
            parentType = 'RFC1918';
        } else if (isRFC6598(networkInput)) {
            parentType = 'RFC6598';
        }

        // Always include all columns
        let parentRow = [
            parentNetwork,           // Network Address
            networkInput,            // IP
            '/' + netsize,          // CIDR
            parentNetmask,          // Mask
            parentType,             // Type
            parentRange,            // Range
            parentUsable,           // Usable IPs
            parentHosts.toString(), // Hosts
            'Parent Network'        // Note
        ];
        tableData.push(parentRow.join('\t'));
    }

    // Add all subnet rows
    $('#calcbody tr').each(function() {
        let row = $(this);
        let rowData = [];

        // Get subnet address
        let subnetAddress = row.find('.row_address').text().trim();
        rowData.push(subnetAddress);

        // Extract IP and CIDR from subnet address if additional columns aren't visible
        let [ip, cidr] = subnetAddress.split('/');

        // Always add ALL columns
        rowData.push(row.find('.row_ip').text().trim() || ip); // IP
        rowData.push(row.find('.row_cidr').text().trim() || '/' + cidr); // CIDR
        rowData.push(row.find('.row_mask').text().trim() || cidr2mask(parseInt(cidr))); // Mask

        // Get type from the row or calculate it
        let typeText = row.find('.row_type').text().trim();
        if (!typeText) {
            // Calculate if not visible
            typeText = 'Public';
            if (isRFC1918(ip)) {
                typeText = 'RFC1918';
            } else if (isRFC6598(ip)) {
                typeText = 'RFC6598';
            }
        }
        rowData.push(typeText); // Type

        rowData.push(row.find('.row_range').text().trim()); // Range
        rowData.push(row.find('.row_usable').text().trim()); // Usable IPs
        rowData.push(row.find('.row_hosts').text().trim()); // Hosts

        // Use existing note, or add "Parent Network" if this is the only row and matches parent
        let note = row.find('.note input').val() || '';
        if (singleRowIsParent && note === '') {
            note = 'Parent Network';
        }
        rowData.push(note);

        tableData.push(rowData.join('\t'));
    });

    // Copy to clipboard with both text and HTML formats
    let textToCopy = tableData.join('\n');

    // Also create HTML table format for Confluence
    let htmlTable = generateHtmlTable(tableData);

    // Try to use ClipboardItem API for multiple formats
    if (navigator.clipboard && navigator.clipboard.write) {
        try {
            const clipboardItem = new ClipboardItem({
                'text/plain': new Blob([textToCopy], { type: 'text/plain' }),
                'text/html': new Blob([htmlTable], { type: 'text/html' })
            });

            navigator.clipboard.write([clipboardItem]).then(function() {
                // Show success feedback
                let btn = $('#copyTable');
                let originalHtml = btn.html();
                btn.html('<i class="bi bi-check-circle"></i> Copied!');
                btn.removeClass('btn-outline-secondary').addClass('btn-success');

                setTimeout(function() {
                    btn.html(originalHtml);
                    btn.removeClass('btn-success').addClass('btn-outline-secondary');
                }, 2000);
            }).catch(function(err) {
                // Fallback to text-only copy
                navigator.clipboard.writeText(textToCopy).then(function() {
                    // Show success feedback
                    let btn = $('#copyTable');
                    let originalHtml = btn.html();
                    btn.html('<i class="bi bi-check-circle"></i> Copied!');
                    btn.removeClass('btn-outline-secondary').addClass('btn-success');

                    setTimeout(function() {
                        btn.html(originalHtml);
                        btn.removeClass('btn-success').addClass('btn-outline-secondary');
                    }, 2000);
                }).catch(function(err2) {
                    show_warning_modal('<div class="alert alert-danger">Failed to copy to clipboard. Please try again.</div>');
                    console.error('Failed to copy: ', err2);
                });
            });
        } catch (e) {
            // Fallback to text-only copy if ClipboardItem is not supported
            navigator.clipboard.writeText(textToCopy).then(function() {
                // Show success feedback
                let btn = $('#copyTable');
                let originalHtml = btn.html();
                btn.html('<i class="bi bi-check-circle"></i> Copied!');
                btn.removeClass('btn-outline-secondary').addClass('btn-success');

                setTimeout(function() {
                    btn.html(originalHtml);
                    btn.removeClass('btn-success').addClass('btn-outline-secondary');
                }, 2000);
            }).catch(function(err) {
                show_warning_modal('<div class="alert alert-danger">Failed to copy to clipboard. Please try again.</div>');
                console.error('Failed to copy: ', err);
            });
        }
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(function() {
            // Show success feedback
            let btn = $('#copyTable');
            let originalHtml = btn.html();
            btn.html('<i class="bi bi-check-circle"></i> Copied!');
            btn.removeClass('btn-outline-secondary').addClass('btn-success');

            setTimeout(function() {
                btn.html(originalHtml);
                btn.removeClass('btn-success').addClass('btn-outline-secondary');
            }, 2000);
        }).catch(function(err) {
            show_warning_modal('<div class="alert alert-danger">Failed to copy to clipboard. Please try again.</div>');
            console.error('Failed to copy: ', err);
        });
    } else {
        // Fallback for browsers that don't support clipboard API
        show_warning_modal('<div class="alert alert-warning">Your browser does not support clipboard access. Please use Ctrl+C/Cmd+C to copy.</div>');
    }
})

// Copy Source and Mirror to clipboard functionality
$('#copySourceAndMirror').on('click', function() {
    // Get labels and mirror network details from modal inputs
    let sourceLabel = $('#sourceLabel').val().trim() || 'Blue';
    let mirrorLabel = $('#mirrorLabel').val().trim() || 'Green';
    let mirrorBase = $('#mirrorNetwork').val().trim();

    if (!mirrorBase) {
        alert('Please enter a mirror network base address');
        return;
    }

    // Validate IPv4 address format
    let ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipv4Regex.test(mirrorBase)) {
        alert('Please enter a valid IPv4 address (e.g., 10.200.0.0)');
        return;
    }

    // Get original network info for alignment check
    let originalSize = parseInt($('#netsize').val());

    // Check that mirror network is properly aligned
    let mirrorInt = ip2int(mirrorBase);
    let maskBits = 32 - originalSize;
    let mirrorAligned = ((mirrorInt >>> maskBits) << maskBits) >>> 0;

    if (mirrorInt !== mirrorAligned) {
        alert('Mirror network must be aligned to /' + originalSize + ' boundary');
        return;
    }

    // Capture current state as source
    let sourceData = captureTableData();

    // Generate mirror data based on source (pass empty string for label to avoid duplication)
    let mirrorData = generateMirrorData(sourceData, mirrorBase, '');

    // Build combined table data with label column
    let tableData = [];

    // Headers with generic Source/Mirror as first column
    let headers = ['Source/Mirror', 'Network Address', 'IP', 'CIDR', 'Mask', 'Type', 'Range of Addresses', 'Usable IPs', 'Hosts', 'Note'];
    tableData.push(headers.join('\t'));

    // Add source parent network
    let sourceParentNetwork = sourceData.network + '/' + sourceData.netsize;
    let sourceParentNetmask = cidr2mask(parseInt(sourceData.netsize));
    let addressFirst = ip2int(sourceData.network);
    let addressLast = subnet_last_address(addressFirst, parseInt(sourceData.netsize));
    let usableFirst = subnet_usable_first(addressFirst, parseInt(sourceData.netsize), operatingMode);
    let usableLast = subnet_usable_last(addressFirst, parseInt(sourceData.netsize));
    let sourceParentHosts = 1 + usableLast - usableFirst;
    let sourceParentRange = int2ip(addressFirst) + ' - ' + int2ip(addressLast);
    if (parseInt(sourceData.netsize) >= 32) {
        sourceParentRange = int2ip(addressFirst);
    }

    let sourceParentUsable = int2ip(usableFirst) + ' - ' + int2ip(usableLast);
    if (parseInt(sourceData.netsize) >= 32) {
        sourceParentUsable = int2ip(usableFirst);
    }

    // Get address type for source parent network
    let sourceParentType = 'Public';
    if (isRFC1918(sourceData.network)) {
        sourceParentType = 'RFC1918';
    } else if (isRFC6598(sourceData.network)) {
        sourceParentType = 'RFC6598';
    }

    // Add source parent row with actual label
    let sourceParentRow = [
        sourceLabel,
        sourceParentNetwork,
        sourceData.network,
        '/' + sourceData.netsize,
        sourceParentNetmask,
        sourceParentType,
        sourceParentRange,
        sourceParentUsable,
        sourceParentHosts.toString(),
        'Parent Network'
    ];
    tableData.push(sourceParentRow.join('\t'));

    // Add all source subnet rows
    sourceData.rows.forEach(function(row) {
        let rowData = [
            sourceLabel,
            row.subnet,
            row.ip,
            row.cidr,
            row.mask,
            row.type,
            row.range,
            row.usable,
            row.hosts,
            row.note
        ];
        tableData.push(rowData.join('\t'));
    });

    // Add mirror data
    // Add mirror parent network
    let mirrorParentNetwork = mirrorData.network + '/' + mirrorData.netsize;
    let mirrorParentNetmask = cidr2mask(parseInt(mirrorData.netsize));
    let mirrorAddressFirst = ip2int(mirrorData.network);
    let mirrorAddressLast = subnet_last_address(mirrorAddressFirst, parseInt(mirrorData.netsize));
    let mirrorUsableFirst = subnet_usable_first(mirrorAddressFirst, parseInt(mirrorData.netsize), operatingMode);
    let mirrorUsableLast = subnet_usable_last(mirrorAddressFirst, parseInt(mirrorData.netsize));
    let mirrorParentHosts = 1 + mirrorUsableLast - mirrorUsableFirst;
    let mirrorParentRange = int2ip(mirrorAddressFirst) + ' - ' + int2ip(mirrorAddressLast);
    if (parseInt(mirrorData.netsize) >= 32) {
        mirrorParentRange = int2ip(mirrorAddressFirst);
    }

    let mirrorParentUsable = int2ip(mirrorUsableFirst) + ' - ' + int2ip(mirrorUsableLast);
    if (parseInt(mirrorData.netsize) >= 32) {
        mirrorParentUsable = int2ip(mirrorUsableFirst);
    }

    // Get address type for mirror parent network
    let mirrorParentType = 'Public';
    if (isRFC1918(mirrorData.network)) {
        mirrorParentType = 'RFC1918';
    } else if (isRFC6598(mirrorData.network)) {
        mirrorParentType = 'RFC6598';
    }

    // Add mirror parent row with actual label
    let mirrorParentRow = [
        mirrorLabel,
        mirrorParentNetwork,
        mirrorData.network,
        '/' + mirrorData.netsize,
        mirrorParentNetmask,
        mirrorParentType,
        mirrorParentRange,
        mirrorParentUsable,
        mirrorParentHosts.toString(),
        'Parent Network'
    ];
    tableData.push(mirrorParentRow.join('\t'));

    // Add all mirror subnet rows
    mirrorData.rows.forEach(function(row) {
        let rowData = [
            mirrorLabel,
            row.subnet,
            row.ip,
            row.cidr,
            row.mask,
            row.type,
            row.range,
            row.usable,
            row.hosts,
            row.note
        ];
        tableData.push(rowData.join('\t'));
    });

    // Join all the data
    let textData = tableData.join('\n');

    // Also create HTML table format for Confluence
    let htmlTableMirror = generateHtmlTable(tableData);

    // Copy to clipboard with both text and HTML formats
    let btn = $(this);
    let originalHtml = btn.html();

    if (navigator.clipboard && navigator.clipboard.write) {
        try {
            const clipboardItem = new ClipboardItem({
                'text/plain': new Blob([textData], { type: 'text/plain' }),
                'text/html': new Blob([htmlTableMirror], { type: 'text/html' })
            });

            navigator.clipboard.write([clipboardItem]).then(function() {
                btn.html('<i class="bi bi-check2"></i> Copied!');
                btn.removeClass('btn-outline-secondary').addClass('btn-success');

                // Reset button after 2 seconds
                setTimeout(function() {
                    btn.html(originalHtml);
                    btn.removeClass('btn-success').addClass('btn-outline-secondary');
                }, 2000);
            }).catch(function(err) {
                // Fallback to text-only copy
                navigator.clipboard.writeText(textData).then(function() {
                    btn.html('<i class="bi bi-check2"></i> Copied!');
                    btn.removeClass('btn-outline-secondary').addClass('btn-success');

                    setTimeout(function() {
                        btn.html(originalHtml);
                        btn.removeClass('btn-success').addClass('btn-outline-secondary');
                    }, 2000);
                }).catch(function(err2) {
                    show_warning_modal('<div class="alert alert-danger">Failed to copy to clipboard. Please try again.</div>');
                    console.error('Failed to copy: ', err2);
                });
            });
        } catch (e) {
            // Fallback to text-only copy if ClipboardItem is not supported
            navigator.clipboard.writeText(textData).then(function() {
                btn.html('<i class="bi bi-check2"></i> Copied!');
                btn.removeClass('btn-outline-secondary').addClass('btn-success');

                setTimeout(function() {
                    btn.html(originalHtml);
                    btn.removeClass('btn-success').addClass('btn-outline-secondary');
                }, 2000);
            }).catch(function(err) {
                show_warning_modal('<div class="alert alert-danger">Failed to copy to clipboard. Please try again.</div>');
                console.error('Failed to copy: ', err);
            });
        }
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textData).then(function() {
            btn.html('<i class="bi bi-check2"></i> Copied!');
            btn.removeClass('btn-outline-secondary').addClass('btn-success');

            setTimeout(function() {
                btn.html(originalHtml);
                btn.removeClass('btn-success').addClass('btn-outline-secondary');
            }, 2000);
        }).catch(function(err) {
            show_warning_modal('<div class="alert alert-danger">Failed to copy to clipboard. Please try again.</div>');
            console.error('Failed to copy: ', err);
        });
    } else {
        // Fallback for browsers that don't support clipboard access
        show_warning_modal('<div class="alert alert-warning">Your browser does not support clipboard access. Please use Ctrl+C/Cmd+C to copy.</div>');
    }
});

// Store source allocation data for dual copy
let sourceAllocationData = null;


// Reorder lines in auto-allocation textarea
$('#moveLineUp').on('click', function() {
    const textarea = $('#subnetRequests')[0];
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    // Find current line
    const lines = text.split('\n');
    let currentLine = 0;
    let charCount = 0;

    for (let i = 0; i < lines.length; i++) {
        if (charCount + lines[i].length >= start) {
            currentLine = i;
            break;
        }
        charCount += lines[i].length + 1; // +1 for newline
    }

    // Move line up if not first line
    if (currentLine > 0) {
        const temp = lines[currentLine];
        lines[currentLine] = lines[currentLine - 1];
        lines[currentLine - 1] = temp;

        textarea.value = lines.join('\n');

        // Restore cursor position (moved up one line)
        const newPos = Math.max(0, start - lines[currentLine].length - 1);
        textarea.setSelectionRange(newPos, newPos);
        textarea.focus();
    }
});

$('#moveLineDown').on('click', function() {
    const textarea = $('#subnetRequests')[0];
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    // Find current line
    const lines = text.split('\n');
    let currentLine = 0;
    let charCount = 0;

    for (let i = 0; i < lines.length; i++) {
        if (charCount + lines[i].length >= start) {
            currentLine = i;
            break;
        }
        charCount += lines[i].length + 1; // +1 for newline
    }

    // Move line down if not last line
    if (currentLine < lines.length - 1) {
        const temp = lines[currentLine];
        lines[currentLine] = lines[currentLine + 1];
        lines[currentLine + 1] = temp;

        textarea.value = lines.join('\n');

        // Restore cursor position (moved down one line)
        const newPos = Math.min(text.length, start + lines[currentLine].length + 1);
        textarea.setSelectionRange(newPos, newPos);
        textarea.focus();
    }
});

// Generate Mirror functionality
$('#generateMirror').on('click', function() {
    // Check if there's a network to mirror
    let networkInput = $('#network').val();
    let netsize = $('#netsize').val();

    if (!networkInput || !netsize || $('#calcbody tr').length === 0) {
        show_warning_modal('<div class="alert alert-danger">No network to mirror. Please calculate a network first.</div>');
        return;
    }

    // Display source network info in modal
    $('#sourceNetworkDisplay').text(networkInput + '/' + netsize);
    $('#mirrorSizeHint').text('Enter the base network for the mirror (must use same CIDR size as original - /' + netsize + ')');

    // Pre-fill the modal with a suggested mirror network
    let currentBase = networkInput.split('.');
    if (currentBase.length === 4) {
        // Try to suggest a mirror by incrementing the second octet
        let secondOctet = parseInt(currentBase[1]);
        let suggestedMirror = currentBase[0] + '.' + (secondOctet + 100) + '.0.0';
        $('#mirrorNetwork').val(suggestedMirror);
    }

    // Reset validation state and trigger validation on pre-filled value
    $('#mirrorNetwork').removeClass('is-valid is-invalid');

    // Show the modal
    let mirrorModal = new bootstrap.Modal(document.getElementById('mirrorModal'));
    mirrorModal.show();

    // Trigger validation after modal is shown
    setTimeout(function() {
        $('#mirrorNetwork').trigger('input');
    }, 100);
});

// Confirm mirror generation
$('#confirmMirror').on('click', function() {
    let mirrorBase = $('#mirrorNetwork').val().trim();
    let mirrorLabel = $('#mirrorLabel').val().trim();

    if (!mirrorBase) {
        alert('Please enter a mirror network base address');
        return;
    }

    // Validate IPv4 address format
    let ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipv4Regex.test(mirrorBase)) {
        alert('Please enter a valid IPv4 address (e.g., 10.200.0.0)');
        return;
    }

    // Get original network info
    let originalNetwork = $('#network').val();
    let originalSize = parseInt($('#netsize').val());

    // Check that mirror network has same size available
    let mirrorInt = ip2int(mirrorBase);
    let originalInt = ip2int(originalNetwork);

    // Calculate if they're in the same size range
    let maskBits = 32 - originalSize;
    let mirrorAligned = ((mirrorInt >>> maskBits) << maskBits) >>> 0;

    if (mirrorInt !== mirrorAligned) {
        alert('Mirror network must be aligned to /' + originalSize + ' boundary');
        return;
    }

    // Close the modal
    let mirrorModal = bootstrap.Modal.getInstance(document.getElementById('mirrorModal'));
    mirrorModal.hide();

    // Generate the mirror allocation
    generateMirrorAllocation(mirrorBase, originalSize, mirrorLabel);
});

// Function to generate mirror data from source data
function generateMirrorData(sourceData, mirrorBase, mirrorLabel) {
    let mirrorData = {
        network: mirrorBase,
        netsize: sourceData.netsize,
        rows: []
    };

    // Calculate mirror subnets based on source
    let sourceBaseInt = ip2int(sourceData.network);
    let mirrorBaseInt = ip2int(mirrorBase);

    sourceData.rows.forEach(function(sourceRow) {
        let [sourceIp, sourceCidr] = sourceRow.subnet.split('/');
        let sourceInt = ip2int(sourceIp);
        let offset = sourceInt - sourceBaseInt;
        let mirrorInt = mirrorBaseInt + offset;
        let mirrorIp = int2ip(mirrorInt);

        // Calculate all the subnet details for the mirror
        let cidr = parseInt(sourceCidr);
        let addressLast = subnet_last_address(mirrorInt, cidr);
        let usableFirst = subnet_usable_first(mirrorInt, cidr, operatingMode);
        let usableLast = subnet_usable_last(mirrorInt, cidr);
        let hosts = 1 + usableLast - usableFirst;

        let range = int2ip(mirrorInt) + ' - ' + int2ip(addressLast);
        if (cidr >= 32) {
            range = int2ip(mirrorInt);
        }

        let usable = int2ip(usableFirst) + ' - ' + int2ip(usableLast);
        if (cidr >= 32) {
            usable = int2ip(usableFirst);
        }

        // Determine type
        let type = 'Public';
        if (isRFC1918(mirrorIp)) {
            type = 'RFC1918';
        } else if (isRFC6598(mirrorIp)) {
            type = 'RFC6598';
        }

        mirrorData.rows.push({
            subnet: mirrorIp + '/' + cidr,
            ip: mirrorIp,
            cidr: '/' + cidr,
            mask: cidr2mask(cidr),
            type: type,
            range: range,
            usable: usable,
            hosts: hosts.toString(),
            note: sourceRow.note + (mirrorLabel ? ' (' + mirrorLabel + ')' : '')
        });
    });

    return mirrorData;
}

// Function to capture table data for later use
function captureTableData() {
    let data = {
        network: $('#network').val(),
        netsize: $('#netsize').val(),
        rows: []
    };

    $('#calcbody tr').each(function() {
        let row = $(this);
        let subnetAddress = row.find('.row_address').text().trim();
        if (subnetAddress) {
            data.rows.push({
                subnet: subnetAddress,
                ip: row.find('.row_ip').text().trim(),
                cidr: row.find('.row_cidr').text().trim(),
                mask: row.find('.row_mask').text().trim(),
                type: row.find('.row_type').text().trim(),
                range: row.find('.row_range').text().trim(),
                usable: row.find('.row_usable').text().trim(),
                hosts: row.find('.row_hosts').text().trim(),
                note: row.find('.note input').val() || ''
            });
        }
    });

    return data;
}

function generateMirrorAllocation(mirrorBase, netSize, label) {
    // Store source allocation data before replacing
    sourceAllocationData = captureTableData();

    // Collect all existing subnets with their sizes
    let subnets = [];
    $('#calcbody tr').each(function() {
        let subnetAddress = $(this).find('.row_address').text().trim();
        if (subnetAddress) {
            let [ip, cidr] = subnetAddress.split('/');
            let note = $(this).find('.note input').val() || '';
            subnets.push({
                originalIp: ip,
                cidr: parseInt(cidr),
                note: note
            });
        }
    });

    if (subnets.length === 0) {
        show_warning_modal('<div class="alert alert-danger">No subnets found to mirror.</div>');
        return;
    }

    // Calculate mirror subnets
    let mirrorSubnets = [];
    let originalBase = ip2int($('#network').val());
    let mirrorBaseInt = ip2int(mirrorBase);

    subnets.forEach(subnet => {
        let originalInt = ip2int(subnet.originalIp);
        let offset = originalInt - originalBase;
        let mirrorInt = mirrorBaseInt + offset;
        let mirrorIp = int2ip(mirrorInt);

        mirrorSubnets.push({
            network: mirrorIp + '/' + subnet.cidr,
            note: subnet.note + (label ? ' (' + label + ')' : ' (Mirror)')
        });
    });

    // Create allocation text for auto-allocation
    let allocationText = mirrorSubnets.map(s => s.network + ',' + s.note).join('\n');

    // Clear current table and run auto-allocation with mirror
    $('#network').val(mirrorBase);
    $('#netsize').val(netSize);
    $('#autoAllocateInput').val(allocationText);

    // Trigger calculation
    $('#btn_go').click();

    // After a short delay, trigger auto-allocation
    setTimeout(function() {
        $('#autoAllocate').click();
    }, 500);
}

// Keyboard navigation for notes field
$('#calcbody').on('keydown', '.note input', function(e) {
    let currentRow = $(this).closest('tr');
    let allRows = $('#calcbody tr');
    let currentIndex = allRows.index(currentRow);

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Tab') {
        e.preventDefault();

        let nextIndex;
        if (e.key === 'ArrowUp') {
            nextIndex = currentIndex - 1;
        } else { // ArrowDown or Tab
            nextIndex = currentIndex + 1;
        }

        if (nextIndex >= 0 && nextIndex < allRows.length) {
            let nextInput = allRows.eq(nextIndex).find('.note input');
            if (nextInput.length) {
                nextInput.focus();
                // Select all text in the input for easy replacement
                nextInput.select();
            }
        }
    }
})

function reset() {

    set_usable_ips_title(operatingMode);

    let cidrInput = $('#network').val() + '/' + $('#netsize').val()
    let rootNetwork = get_network($('#network').val(), $('#netsize').val())
    let rootCidr = rootNetwork + '/' + $('#netsize').val()
    if (cidrInput !== rootCidr) {
        show_warning_modal('<div>Your network input is not on a network boundary for this network size. It has been automatically changed:</div><div class="font-monospace pt-2">' + $('#network').val() + ' -> ' + rootNetwork + '</div>')
        $('#network').val(rootNetwork)
        cidrInput = $('#network').val() + '/' + $('#netsize').val()
    }
    if (Object.keys(subnetMap).length > 0) {
        // This page already has data imported, so lets see if we can just change the range
        if (isMatchingSize(Object.keys(subnetMap)[0], cidrInput)) {
            subnetMap = changeBaseNetwork(cidrInput)
        } else {
            // This is a page with existing data of a different subnet size, so make it blank
            // Could be an opportunity here to do the following:
            //   - Prompt the user to confirm they want to clear the existing data
            //   - Resize the existing data anyway by making the existing network a subnetwork of their new input (if it
            //     is a larger network), or by just trimming the network to the new size (if it is a smaller network),
            //     or even resizing all of the containing networks by change in size of the base network. For example a
            //     base network going from /16 -> /18 would be all containing networks would be resized smaller (/+2),
            //     or bigger (/-2) if going from /18 -> /16.
            subnetMap = {}
            subnetMap[rootCidr] = {}
        }
    } else {
        // This is a fresh page load with no existing data
        subnetMap[rootCidr] = {}
    }
    maxNetSize = parseInt($('#netsize').val())
    renderTable(operatingMode);
}

function changeBaseNetwork(newBaseNetwork) {
    // Minifiy it, to make all the keys in the subnetMap relative to their original base network
    // Then expand it, but with the new CIDR as the base network, effectively converting from old to new.
    let miniSubnetMap = {}
    minifySubnetMap(miniSubnetMap, subnetMap, Object.keys(subnetMap)[0])
    let newSubnetMap = {}
    expandSubnetMap(newSubnetMap, miniSubnetMap, newBaseNetwork)
    return newSubnetMap
}

function isMatchingSize(subnet1, subnet2) {
    return subnet1.split('/')[1] === subnet2.split('/')[1];
}

$('#calcbody').on('click', 'td.split,td.join', function(event) {
    // HTML DOM Data elements! Yay! See the `data-*` attributes of the HTML tags
    mutate_subnet_map(this.dataset.mutateVerb, this.dataset.subnet, '')
    this.dataset.subnet = sortIPCIDRs(this.dataset.subnet)
    renderTable(operatingMode);

    // Update browser history after split/join operation
    updateBrowserHistory();
})

$('#calcbody').on('keyup', 'td.note input', function(event) {
    // HTML DOM Data elements! Yay! See the `data-*` attributes of the HTML tags
    let delay = FEEDBACK_DURATION_MS;
    clearTimeout(noteTimeout);
    noteTimeout = setTimeout(function(element) {
        mutate_subnet_map('note', element.dataset.subnet, '', element.value)
        updateBrowserHistory();
    }, delay, this);
})

$('#calcbody').on('focusout', 'td.note input', function(event) {
    // HTML DOM Data elements! Yay! See the `data-*` attributes of the HTML tags
    clearTimeout(noteTimeout);
    mutate_subnet_map('note', this.dataset.subnet, '', this.value)
    updateBrowserHistory();
})


function renderTable(operatingMode) {
    // TODO: Validation Code
    $('#calcbody').empty();
    let maxDepth = get_dict_max_depth(subnetMap, 0)
    addRowTree(subnetMap, 0, maxDepth, operatingMode)
    updatePrintAttributes();
}

function updatePrintAttributes() {
    // Set the network title for printing
    const network = $('#network').val();
    const netsize = $('#netsize').val();
    if (network && netsize) {
        const printTitle = `${network}/${netsize}`;
        $('body').attr('data-print-title', printTitle);
    }

    // Set the current URL for printing
    $('body').attr('data-print-url', getConfigUrl());

    // Add print footer element after the table if it doesn't exist
    if (!$('.print-footer').length) {
        const safeUrl = escapeHtml(getConfigUrl());
        const footerHtml = `<div class="print-footer">URL: ${safeUrl}</div>`;
        $('#calc').after(footerHtml);
    } else {
        // Update the footer content if it already exists
        const safeUrl = escapeHtml(getConfigUrl());
        $('.print-footer').html(`URL: ${safeUrl}`);
    }
}

function addRowTree(subnetTree, depth, maxDepth, operatingMode) {
    for (let mapKey in subnetTree) {
        if (mapKey.startsWith('_')) { continue; }
        if (has_network_sub_keys(subnetTree[mapKey])) {
            addRowTree(subnetTree[mapKey], depth + 1, maxDepth,operatingMode)
        } else {
            let subnet_split = mapKey.split('/')
            let notesWidth = '30%';
            if ((maxDepth > 5) && (maxDepth <= 10)) {
                notesWidth = '25%';
            } else if ((maxDepth > 10) && (maxDepth <= 15)) {
                notesWidth = '20%';
            } else if ((maxDepth > 15) && (maxDepth <= 20)) {
                notesWidth = '15%';
            } else if (maxDepth > 20) {
                notesWidth = '10%';
            }
            addRow(subnet_split[0], parseInt(subnet_split[1]), (infoColumnCount + maxDepth - depth), (subnetTree[mapKey]['_note'] || ''), notesWidth, (subnetTree[mapKey]['_color'] || ''),operatingMode)
        }
    }
}

function addRow(network, netSize, colspan, note, notesWidth, color, operatingMode) {
    let addressFirst = ip2int(network)
    let addressLast = subnet_last_address(addressFirst, netSize)
    let usableFirst = subnet_usable_first(addressFirst, netSize, operatingMode)
    let usableLast = subnet_usable_last(addressFirst, netSize)
    let hostCount = 1 + usableLast - usableFirst

    // Determine address type for Type column
    let addressType = getAddressType(network);
    let addressTypeDisplay = 'Public';
    let rowClass = '';
    if (addressType === 'rfc1918') {
        addressTypeDisplay = 'RFC1918';
        rowClass = ' class="rfc1918-row"';
    } else if (addressType === 'rfc6598') {
        addressTypeDisplay = 'RFC6598';
        rowClass = ' class="rfc6598-row"';
    }

    let styleTag = ''
    if (color !== '') {
        styleTag = ' style="background-color: ' + color + '"'
    }

    let rangeCol, usableCol;
    if (netSize < 32) {
        rangeCol = int2ip(addressFirst) + ' - ' + int2ip(addressLast);
        usableCol = int2ip(usableFirst) + ' - ' + int2ip(usableLast);
    } else {
        rangeCol = int2ip(addressFirst);
        usableCol = int2ip(usableFirst);
    }
    let rowId = 'row_' + network.replace('.', '-') + '_' + netSize
    let rowCIDR = network + '/' + netSize
    let subnetMask = cidr2mask(netSize)
    let additionalDisplay = additionalColumnsVisible ? '' : ' style="display: none;"'
    let newRow =
        '            <tr id="' + rowId + '"' + styleTag + rowClass + '  aria-label="' + rowCIDR + '">\n' +
        '                <td data-subnet="' + rowCIDR + '" aria-labelledby="' + rowId + ' subnetHeader" class="row_address"><a href="https://cidr.xyz/#' + encodeURIComponent(rowCIDR) + '" target="_blank" class="text-decoration-underline" data-bs-toggle="tooltip" data-bs-placement="top" title="Look up on cidr.xyz">' + rowCIDR + '</a></td>\n' +
        '                <td data-subnet="' + rowCIDR + '" aria-labelledby="' + rowId + ' ipHeader" class="row_ip additional-column"' + additionalDisplay + '>' + network + '</td>\n' +
        '                <td data-subnet="' + rowCIDR + '" aria-labelledby="' + rowId + ' cidrHeader" class="row_cidr additional-column"' + additionalDisplay + '>/' + netSize + '</td>\n' +
        '                <td data-subnet="' + rowCIDR + '" aria-labelledby="' + rowId + ' maskHeader" class="row_mask additional-column"' + additionalDisplay + '>' + subnetMask + '</td>\n' +
        '                <td data-subnet="' + rowCIDR + '" aria-labelledby="' + rowId + ' typeHeader" class="row_type additional-column"' + additionalDisplay + '>' + addressTypeDisplay + '</td>\n' +
        '                <td data-subnet="' + rowCIDR + '" aria-labelledby="' + rowId + ' rangeHeader" class="row_range">' + rangeCol + '</td>\n' +
        '                <td data-subnet="' + rowCIDR + '" aria-labelledby="' + rowId + ' useableHeader" class="row_usable">' + usableCol + '</td>\n' +
        '                <td data-subnet="' + rowCIDR + '" aria-labelledby="' + rowId + ' hostsHeader" class="row_hosts">' + hostCount + '</td>\n' +
        '                <td class="note" style="width:' + notesWidth + '"><label><input aria-labelledby="' + rowId + ' noteHeader" type="text" class="form-control shadow-none p-0" data-subnet="' + rowCIDR + '" value="' + note + '"></label></td>\n' +
        '                <td data-subnet="' + rowCIDR + '" aria-labelledby="' + rowId + ' splitHeader" rowspan="1" colspan="' + colspan + '" class="split rotate" data-mutate-verb="split"><span>/' + netSize + '</span></td>\n'
    if (netSize > maxNetSize) {
        // This is wrong. Need to figure out a way to get the number of children so you can set rowspan and the number
        // of ancestors so you can set colspan.
        // DONE: If the subnet address (without the mask) matches a larger subnet address
        // in the heirarchy that is a signal to add more join buttons to that row, since they start at the top row and
        // via rowspan extend downward.
        let matchingNetworkList = get_matching_network_list(network, subnetMap).slice(1)
        for (const i in matchingNetworkList) {
            let matchingNetwork = matchingNetworkList[i]
            let networkChildrenCount = count_network_children(matchingNetwork, subnetMap, [])
            newRow += '                <td aria-label="' + matchingNetwork + ' Join" rowspan="' + networkChildrenCount + '" colspan="1" class="join rotate" data-subnet="' + matchingNetwork + '" data-mutate-verb="join"><span>/' + matchingNetwork.split('/')[1] + '</span></td>\n'
        }
    }
    newRow += '            </tr>';

    $('#calcbody').append(newRow)
}


// Helper Functions
function ip2int(ip) {
    return ip.split('.').reduce(function(ipInt, octet) { return (ipInt<<8) + parseInt(octet, 10)}, 0) >>> 0;
}

function int2ip (ipInt) {
    return ((ipInt>>>24) + '.' + (ipInt>>16 & 255) + '.' + (ipInt>>8 & 255) + '.' + (ipInt & 255));
}

function cidr2mask(cidr) {
    let mask = 0xFFFFFFFF << (32 - cidr);
    return int2ip(mask >>> 0);
}

// Check if an IP address is in RFC1918 private address space
function isRFC1918(ip) {
    const ipInt = typeof ip === 'string' ? ip2int(ip) : ip;

    // 10.0.0.0/8 (10.0.0.0 - 10.255.255.255)
    if (ipInt >= 0x0A000000 && ipInt <= 0x0AFFFFFF) return true;

    // 172.16.0.0/12 (172.16.0.0 - 172.31.255.255)
    if (ipInt >= 0xAC100000 && ipInt <= 0xAC1FFFFF) return true;

    // 192.168.0.0/16 (192.168.0.0 - 192.168.255.255)
    if (ipInt >= 0xC0A80000 && ipInt <= 0xC0A8FFFF) return true;

    return false;
}

// Check if an IP address is in RFC6598 shared address space (CGNAT)
function isRFC6598(ip) {
    const ipInt = typeof ip === 'string' ? ip2int(ip) : ip;

    // 100.64.0.0/10 (100.64.0.0 - 100.127.255.255)
    return ipInt >= 0x64400000 && ipInt <= 0x647FFFFF;
}

// Get the address type for display
function getAddressType(ip) {
    if (isRFC1918(ip)) return 'rfc1918';
    if (isRFC6598(ip)) return 'rfc6598';
    return 'public';
}


function toBase36(num) {
    return num.toString(36);
}

function fromBase36(str) {
    return parseInt(str, 36);
}

/**
 * Coordinate System for Subnet Representation
 *
 * This system aims to represent subnets efficiently within a larger network space.
 * The goal is to produce the shortest possible string representation for subnets,
 * which is particularly effective when dealing with hierarchical network designs.
 *
 * Key concept:
 * - We represent a subnet by its ordinal position within a larger network,
 *   along with its mask size.
 * - This approach is most efficient when subnets are relatively close together
 *   in the address space and of similar sizes.
 *
 * Benefits:
 * 1. Compact representation: Often results in very short strings (e.g., "7k").
 * 2. Hierarchical: Naturally represents subnet hierarchy.
 * 3. Efficient for common cases: Works best for typical network designs where
 *    subnets are grouped and of similar sizes.
 *
 * Trade-offs:
 * - Less efficient for representing widely dispersed or highly varied subnet sizes.
 * - Requires knowledge of the base network to interpret.
 *
 * Extreme Example... Representing the value 192.168.200.210/31 within the base
 * network of 192.168.200.192/27. These are arbitrary but long subnets to represent
 * as a string.
 * - Normal Way - '192.168.200.210/31'
 * - Nth Position Way - '9v'
 *   - '9' represents the 9th /31 subnet within the /27
 *   - 'v' represents the /31 mask size converted to Base 36 (31 -> 'v')
 */

/**
 * Converts a specific subnet to its Nth position representation within a base network.
 *
 * @param {string} baseNetwork - The larger network containing the subnet (e.g., "10.0.0.0/16")
 * @param {string} specificSubnet - The subnet to be represented (e.g., "10.0.112.0/20")
 * @returns {string} A compact string representing the subnet's position and size (e.g., "7k")
 */
function getNthSubnet(baseNetwork, specificSubnet) {
    const [baseIp, baseMask] = baseNetwork.split('/');
    const [specificIp, specificMask] = specificSubnet.split('/');

    const baseInt = ip2int(baseIp);
    const specificInt = ip2int(specificIp);

    const baseSize = 32 - parseInt(baseMask, 10);
    const specificSize = 32 - parseInt(specificMask, 10);

    const offset = specificInt - baseInt;
    const nthSubnet = offset >>> specificSize;

    return `${nthSubnet}${toBase36(parseInt(specificMask, 10))}`;
}


/**
 * Reconstructs a subnet from its Nth position representation within a base network.
 *
 * @param {string} baseNetwork - The larger network containing the subnet (e.g., "10.0.0.0/16")
 * @param {string} nthString - The compact representation of the subnet (e.g., "7k")
 * @returns {string} The full subnet representation (e.g., "10.0.112.0/20")
 */
// Takes 10.0.0.0/16 and '7k' and returns 10.0.96.0/20
// '10.0.96.0/20' being the 7th /20 (base36 'k' is 20 int) within the /16.
function getSubnetFromNth(baseNetwork, nthString) {
    const [baseIp, baseMask] = baseNetwork.split('/');
    const baseInt = ip2int(baseIp);

    const size = fromBase36(nthString.slice(-1));
    const nth = parseInt(nthString.slice(0, -1), 10);

    const innerSizeInt = 32 - size;
    const subnetInt = baseInt + (nth << innerSizeInt);

    return `${int2ip(subnetInt)}/${size}`;
}

function subnet_last_address(subnet, netSize) {
    return subnet + subnet_addresses(netSize) - 1;
}

function subnet_addresses(netSize) {
    return 2**(32-netSize);
}

function subnet_usable_first(network, netSize, operatingMode) {
    if (netSize < 31) {
        // https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html
        // AWS reserves 3 additional IPs
        // https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-faq#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets
        // Azure reserves 3 additional IPs
        // https://cloud.google.com/vpc/docs/subnets
        // GCP reserves 2 additional IPs at the start
        // https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/overview.htm#Reserved__reserved_subnet
        // OCI reserves 2 additional IPs
        //return network + (operatingMode == 'Standard' ? 1 : 4);
        switch (operatingMode) {
            case 'AWS':
            case 'AZURE':
                return network + 4;
                break;
            case 'GCP':
            case 'OCI':
                return network + 2;
                break;
            default:
                return network + 1;
                break;
        }            
    } else {
        return network;
    }
}

function subnet_usable_last(network, netSize, operatingMode) {
    let last_address = subnet_last_address(network, netSize);
    if (netSize < 31) {
        // GCP reserves the last 2 addresses (second-to-last and broadcast)
        if (operatingMode === 'GCP') {
            return last_address - 2;
        } else {
            return last_address - 1;
        }
    } else {
        return last_address;
    }
}

function get_dict_max_depth(dict, curDepth) {
    let maxDepth = curDepth
    for (let mapKey in dict) {
        if (mapKey.startsWith('_')) { continue; }
        let newDepth = get_dict_max_depth(dict[mapKey], curDepth + 1)
        if (newDepth > maxDepth) { maxDepth = newDepth }
    }
    return maxDepth
}


function get_join_children(subnetTree, childCount) {
    for (let mapKey in subnetTree) {
        if (mapKey.startsWith('_')) { continue; }
        if (has_network_sub_keys(subnetTree[mapKey])) {
            childCount += get_join_children(subnetTree[mapKey])
        } else {
            return childCount
        }
    }
}

function has_network_sub_keys(dict) {
    let allKeys = Object.keys(dict)
    // Maybe an efficient way to do this with a Lambda?
    for (let i in allKeys) {
        if (!allKeys[i].startsWith('_') && allKeys[i] !== 'n' && allKeys[i] !== 'c') {
            return true
        }
    }
    return false
}

function count_network_children(network, subnetTree, ancestryList) {
    // TODO: This might be able to be optimized. Ultimately it needs to count the number of keys underneath
    // the current key are unsplit networks (IE rows in the table, IE keys with a value of {}).
    let childCount = 0
    for (let mapKey in subnetTree) {
        if (mapKey.startsWith('_')) { continue; }
        if (has_network_sub_keys(subnetTree[mapKey])) {
            childCount += count_network_children(network, subnetTree[mapKey], ancestryList.concat([mapKey]))
        } else {
            if (ancestryList.includes(network)) {
                childCount += 1
            }
        }
    }
    return childCount
}

function get_network_children(network, subnetTree) {
    // TODO: This might be able to be optimized. Ultimately it needs to count the number of keys underneath
    // the current key are unsplit networks (IE rows in the table, IE keys with a value of {}).
    let subnetList = []
    for (let mapKey in subnetTree) {
        if (mapKey.startsWith('_')) { continue; }
        if (has_network_sub_keys(subnetTree[mapKey])) {
            subnetList.push.apply(subnetList, get_network_children(network, subnetTree[mapKey]))
        } else {
            subnetList.push(mapKey)
        }
    }
    return subnetList
}

function get_matching_network_list(network, subnetTree) {
    let subnetList = []
    for (let mapKey in subnetTree) {
        if (mapKey.startsWith('_')) { continue; }
        if (has_network_sub_keys(subnetTree[mapKey])) {
            subnetList.push.apply(subnetList, get_matching_network_list(network, subnetTree[mapKey]))
        }
        if (mapKey.split('/')[0] === network) {
            subnetList.push(mapKey)
        }
    }
    return subnetList
}

function get_consolidated_property(subnetTree, property) {
    let allValues = get_property_values(subnetTree, property)
    // https://stackoverflow.com/questions/14832603/check-if-all-values-of-array-are-equal
    let allValuesMatch = allValues.every( (val, i, arr) => val === arr[0] )
    if (allValuesMatch) {
        return allValues[0]
    } else {
        return ''
    }
}

function get_property_values(subnetTree, property) {
    let propValues = []
    for (let mapKey in subnetTree) {
        if (has_network_sub_keys(subnetTree[mapKey])) {
            propValues.push.apply(propValues, get_property_values(subnetTree[mapKey], property))
        } else {
            // The "else" above is a bit different because it will start tracking values for subnets which are
            // in the hierarchy, but not displayed. Those are always blank so it messes up the value list
            propValues.push(subnetTree[mapKey][property] || '')
        }
    }
    return propValues
}

function get_network(networkInput, netSize) {
    let ipInt = ip2int(networkInput)
    netSize = parseInt(netSize)
    for (let i=31-netSize; i>=0; i--) {
        ipInt &= ~ 1<<i;
    }
    return int2ip(ipInt);
}

function split_network(networkInput, netSize) {
    let subnets = [networkInput + '/' + (netSize + 1)]
    let newSubnet = ip2int(networkInput) + 2**(32-netSize-1);
    subnets.push(int2ip(newSubnet) + '/' + (netSize + 1))
    return subnets;
}

function mutate_subnet_map(verb, network, subnetTree, propValue = '') {
    if (subnetTree === '') { subnetTree = subnetMap }
    for (let mapKey in subnetTree) {
        if (mapKey.startsWith('_')) { continue; }
        if (has_network_sub_keys(subnetTree[mapKey])) {
            mutate_subnet_map(verb, network, subnetTree[mapKey], propValue)
        }
        if (mapKey === network) {
            let netSplit = mapKey.split('/')
            let netSize = parseInt(netSplit[1])
            if (verb === 'split') {
                if (netSize < minSubnetSizes[operatingMode]) {
                    let new_networks = split_network(netSplit[0], netSize)
                    // Could maybe optimize this for readability with some null coalescing
                    subnetTree[mapKey][new_networks[0]] = {}
                    subnetTree[mapKey][new_networks[1]] = {}
                    // Options:
                    //   [ Selected ] Copy note to both children and delete parent note
                    //   [ Possible ] Blank out the new and old subnet notes
                    if (subnetTree[mapKey].hasOwnProperty('_note')) {
                        subnetTree[mapKey][new_networks[0]]['_note'] = subnetTree[mapKey]['_note']
                        subnetTree[mapKey][new_networks[1]]['_note'] = subnetTree[mapKey]['_note']
                    }
                    delete subnetTree[mapKey]['_note']
                    if (subnetTree[mapKey].hasOwnProperty('_color')) {
                        subnetTree[mapKey][new_networks[0]]['_color'] = subnetTree[mapKey]['_color']
                        subnetTree[mapKey][new_networks[1]]['_color'] = subnetTree[mapKey]['_color']
                    }
                    delete subnetTree[mapKey]['_color']
                } else {
                    switch (operatingMode) {
                        case 'AWS':
                            var modal_error_message = 'The minimum IPv4 subnet size for AWS is /' + minSubnetSizes[operatingMode] + '.<br/><br/>More Information:<br/><a href="https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html#subnet-sizing-ipv4" target="_blank" rel="noopener noreferrer">Amazon Virtual Private Cloud > User Guide > Subnet CIDR Blocks > Subnet Sizing for IPv4</a>'
                            break;
                        case 'AZURE':
                            var modal_error_message = 'The minimum IPv4 subnet size for Azure is /' + minSubnetSizes[operatingMode] + '.<br/><br/>More Information:<br/><a href="https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-faq#how-small-and-how-large-can-virtual-networks-and-subnets-be" target="_blank" rel="noopener noreferrer">Azure Virtual Network FAQ > How small and how large can virtual networks and subnets be?</a>'
                            break;
                        case 'GCP':
                            var modal_error_message = 'The minimum IPv4 subnet size for GCP is /' + minSubnetSizes[operatingMode] + '.<br/><br/>More Information:<br/><a href="https://cloud.google.com/vpc/docs/subnets#unusable-ip-addresses-in-every-subnet" target="_blank" rel="noopener noreferrer">Google Cloud VPC > Subnets > Unusable addresses in IPv4 subnet ranges</a>'
                            break;
                        case 'OCI':
                            var modal_error_message = 'The minimum IPv4 subnet size for OCI is /' + minSubnetSizes[operatingMode] + '.<br/><br/>More Information:<br/><a href="https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/overview.htm#Reserved__reserved_subnet" target="_blank" rel="noopener noreferrer">Infrastructure Services>Networking>Networking Overview>Three IP Addresses in Each Subnet</a>'
                            break;
                        default:
                            var modal_error_message = 'The minimum size for an IPv4 subnet is /' + minSubnetSizes[operatingMode] + '.<br/><br/>More Information:<br/><a href="https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing" target="_blank" rel="noopener noreferrer">Wikipedia - Classless Inter-Domain Routing</a>'
                            break;
                    }
                    show_warning_modal('<div>' + modal_error_message + '</div>')
                }
            } else if (verb === 'join') {
                // Options:
                //   [ Selected ] Keep note if all the notes are the same, blank them out if they differ. Most intuitive
                //   [ Possible ] Lose note data for all deleted subnets.
                //   [ Possible ] Keep note from first subnet in the join scope. Reasonable but I think rarely will the note be kept by the user
                //   [ Possible ] Concatenate all notes. Ugly and won't really be useful for more than two subnets being joined
                subnetTree[mapKey] = {
                    '_note': get_consolidated_property(subnetTree[mapKey], '_note'),
                    '_color': get_consolidated_property(subnetTree[mapKey], '_color')
                }
            } else if (verb === 'note') {
                subnetTree[mapKey]['_note'] = propValue
            } else if (verb === 'color') {
                subnetTree[mapKey]['_color'] = propValue
            } else {
                // How did you get here?
            }
        }
    }
}

function switchMode(operatingMode) {

    let isSwitched = true;

    if (subnetMap !== null) {
        if (validateSubnetSizes(subnetMap, minSubnetSizes[operatingMode])) {

            renderTable(operatingMode);
            set_usable_ips_title(operatingMode);

            $('#netsize').attr('pattern', netsizePatterns[operatingMode]);
            $('#input_form').removeClass('was-validated');
            $('#input_form').rules('remove', 'netsize');

            switch (operatingMode) {
                case 'AWS':
                    var validate_error_message = 'AWS Mode - Smallest size is /' + minSubnetSizes[operatingMode]
                    break;
                case 'AZURE':
                    var validate_error_message = 'Azure Mode - Smallest size is /' + minSubnetSizes[operatingMode]
                    break;
                case 'GCP':
                    var validate_error_message = 'GCP Mode - Smallest size is /' + minSubnetSizes[operatingMode]
                    break;
                case 'OCI':
                    var validate_error_message = 'OCI Mode - Smallest size is /' + minSubnetSizes[operatingMode]
                    break;
                default:
                    var validate_error_message = 'Smallest size is /' + minSubnetSizes[operatingMode]
                    break;
            }


            // Modify jquery validation rule
            $('#input_form #netsize').rules('add', {
                required: true,
                pattern: netsizePatterns[operatingMode],
                messages: {
                    required: 'Please enter a network size',
                    pattern: validate_error_message
                }
            });
            // Remove active class from all buttons if needed
            $('#dropdown_standard, #dropdown_azure, #dropdown_aws, #dropdown_gcp, #dropdown_oci').removeClass('active');
            $('#dropdown_' + operatingMode.toLowerCase()).addClass('active');
            isSwitched = true;
        } else {
            switch (operatingMode) {
                case 'AWS':
                    var modal_error_message = 'One or more subnets are smaller than the minimum allowed for AWS.<br/>The smallest size allowed is /' + minSubnetSizes[operatingMode] + '.<br/>See: <a href="https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html#subnet-sizing-ipv4" target="_blank" rel="noopener noreferrer">Amazon Virtual Private Cloud > User Guide > Subnet CIDR Blocks > Subnet Sizing for IPv4</a>'
                    break;
                case 'AZURE':
                    var modal_error_message = 'One or more subnets are smaller than the minimum allowed for Azure.<br/>The smallest size allowed is /' + minSubnetSizes[operatingMode] + '.<br/>See: <a href="https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-faq#how-small-and-how-large-can-virtual-networks-and-subnets-be" target="_blank" rel="noopener noreferrer">Azure Virtual Network FAQ > How small and how large can virtual networks and subnets be?</a>'
                    break;
                case 'GCP':
                    var modal_error_message = 'One or more subnets are smaller than the minimum allowed for GCP.<br/>The smallest size allowed is /' + minSubnetSizes[operatingMode] + '.<br/>See: <a href="https://cloud.google.com/vpc/docs/subnets#unusable-ip-addresses-in-every-subnet" target="_blank" rel="noopener noreferrer">Google Cloud VPC > Subnets > Unusable addresses in IPv4 subnet ranges</a>'
                    break;
                case 'OCI':
                    var modal_error_message = 'One or more subnets are smaller than the minimum allowed for OCI.<br/>The smallest size allowed is /' + minSubnetSizes[operatingMode] + '.<br/>See: <a href="https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/overview.htm#Reserved__reserved_subnet" target="_blank" rel="noopener noreferrer">Infrastructure Services>Networking>Networking Overview>Three IP Addresses in Each Subnet</a>'
                    break;
                default:
                    var validate_error_message = 'Unknown Error'
                    break;
            }
            show_warning_modal('<div>' + modal_error_message + '</div>');
            isSwitched = false;
        }
    } else {
        //unlikely to get here.
        reset();
    }

    return isSwitched;


}

function validateSubnetSizes(subnetMap, minSubnetSize) {
    let isValid = true;
    const validate = (subnetTree) => {
        for (let key in subnetTree) {
            if (key.startsWith('_')) continue; // Skip special keys
            let [_, size] = key.split('/');
            if (parseInt(size) > minSubnetSize) {
                isValid = false;
                return; // Early exit if any subnet is invalid
            }
            if (typeof subnetTree[key] === 'object') {
                validate(subnetTree[key]); // Recursively validate subnets
            }
        }
    };
    validate(subnetMap);
    return isValid;
}


function set_usable_ips_title(operatingMode) {
    switch (operatingMode) {
        case 'AWS':
            $('#useableHeader').html('Usable IPs (<a href="https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html#subnet-sizing-ipv4" target="_blank" rel="noopener noreferrer" class="cloud-mode-link" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" title="AWS reserves 5 addresses in each subnet for platform use.<br/>Click to navigate to the AWS documentation.">AWS</a>)')
            break;
        case 'AZURE':
            $('#useableHeader').html('Usable IPs (<a href="https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-faq#are-there-any-restrictions-on-using-ip-addresses-within-these-subnets" target="_blank" rel="noopener noreferrer" class="cloud-mode-link" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" title="Azure reserves 5 addresses in each subnet for platform use.<br/>Click to navigate to the Azure documentation.">Azure</a>)')
            break;
        case 'GCP':
            $('#useableHeader').html('Usable IPs (<a href="https://cloud.google.com/vpc/docs/subnets#unusable-ip-addresses-in-every-subnet" target="_blank" rel="noopener noreferrer" style="color:#000; border-bottom: 1px dotted #000; text-decoration: dotted" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" title="GCP reserves 4 addresses in each subnet for platform use.<br/>Click to navigate to the GCP documentation.">GCP</a>)')
            break;
        case 'OCI':
            $('#useableHeader').html('Usable IPs (<a href="https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/overview.htm#Reserved__reserved_subnet" target="_blank" rel="noopener noreferrer" class="cloud-mode-link" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-html="true" title="OCI reserves 3 addresses in each subnet for platform use.<br/>Click to navigate to the OCI documentation.">OCI</a>)')
            break;
        default:
            $('#useableHeader').html('Usable IPs')
            break;
    }
    $('[data-bs-toggle="tooltip"]').tooltip()
}

function show_warning_modal(message) {
    var notifyModal = new bootstrap.Modal(document.getElementById('notifyModal'), {});
    $('#notifyModal .modal-body').html(message)
    notifyModal.show()
}

$( document ).ready(function() {

    // Initialize the jQuery Validation on the form
    var validator = $('#input_form').validate({
        onfocusout: function (element) {
            $(element).valid();
        },
        rules: {
            network: {
                required: true,
                pattern: '^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
            },
            netsize: {
                required: true,
                pattern: '^([0-9]|[12][0-9]|3[0-2])$'
            }
        },
        messages: {
            network: {
                required: 'Please enter a network',
                pattern: 'Must be a valid IPv4 Address'
            },
            netsize: {
                required: 'Please enter a network size',
                pattern: 'Smallest size is /32'
            }
        },
        errorPlacement: function(error, element) {
            //console.log(error);
            //console.log(element);
            if (error[0].innerHTML !== '') {
                //console.log('Error Placement - Text')
                if (!element.data('errorIsVisible')) {
                    bootstrap.Tooltip.getInstance(element).setContent({'.tooltip-inner': error[0].innerHTML})
                    element.tooltip('show');
                    element.data('errorIsVisible', true)
                }
            } else {
                //console.log('Error Placement - Empty')
                //console.log(element);
                if (element.data('errorIsVisible')) {
                    element.tooltip('hide');
                    element.data('errorIsVisible', false)
                }

            }
            //console.log(element);
        },
        // This success function appears to be required as errorPlacement() does not fire without the success function
        // being defined.
        success: function(label, element) { },
        // When the form is valid, add the 'was-validated' class
        submitHandler: function(form) {
            form.classList.add('was-validated');
            form.submit(); // Submit the form
        }
    });

    let autoConfigResult = processConfigUrl();
    if (!autoConfigResult) {
        reset();
        // Only set initial state if we didn't process a config URL (processConfigUrl sets it)
        window.history.replaceState(exportConfig(false), '', window.location.pathname);
    }
});

function exportConfig(isMinified = true) {
    const baseNetwork = Object.keys(subnetMap)[0]
    let miniSubnetMap = {};
    subnetMap = sortIPCIDRs(subnetMap)
    if (isMinified) {
        minifySubnetMap(miniSubnetMap, subnetMap, baseNetwork)
    }
    if (operatingMode !== 'Standard') {
        return {
            'config_version': configVersion,
            'operating_mode': operatingMode,
            'base_network': baseNetwork,
            'subnets': isMinified ? miniSubnetMap : subnetMap,
        }
    } else {
        return {
            'config_version': configVersion,
            'base_network': baseNetwork,
            'subnets': isMinified ? miniSubnetMap : subnetMap,
        }
    }
}

function getConfigUrl() {
    // Deep Copy
    let defaultExport = JSON.parse(JSON.stringify(exportConfig(true)));
    renameKey(defaultExport, 'config_version', 'v')
    renameKey(defaultExport, 'base_network', 'b')
    if (defaultExport.hasOwnProperty('operating_mode')) {
        renameKey(defaultExport, 'operating_mode', 'm')
    }
    renameKey(defaultExport, 'subnets', 's')
    //console.log(JSON.stringify(defaultExport))
    return (vscParentUrl || window.location.origin + '/' + vscHtmlFileName) + '?c=' + urlVersion + LZString.compressToEncodedURIComponent(JSON.stringify(defaultExport))
}

function updateBrowserHistory() {
    // Store state in browser history without changing the URL (keeps URLs clean)
    // The ugly compressed URL is only used when explicitly sharing via "Copy Shareable URL"
    const currentState = exportConfig(false);

    // Only push state if it's actually different from the current state
    if (JSON.stringify(window.history.state) !== JSON.stringify(currentState)) {
        // Use replaceState for the initial state, pushState for subsequent changes
        if (!window.history.state) {
            window.history.replaceState(currentState, '');
        } else {
            window.history.pushState(currentState, '', window.location.pathname);
        }
    }
}

// Handle browser back/forward navigation
window.addEventListener('popstate', function(event) {
    if (event.state) {
        // Restore the state from history
        importConfig(event.state);
        renderTable(operatingMode);
    } else {
        // If no state, try to process the URL
        processConfigUrl();
    }
});

function processConfigUrl() {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    const config = vscUrlParams.c || params['c'];
    if (config !== null) {
        // First character is the version of the URL string, in case the mechanism of encoding changes
        let urlVersion = config.substring(0, 1)
        let urlData = config.substring(1)
        let urlConfig = JSON.parse(LZString.decompressFromEncodedURIComponent(config.substring(1)))
        renameKey(urlConfig, 'v', 'config_version')
        if (urlConfig.hasOwnProperty('m')) {
            renameKey(urlConfig, 'm', 'operating_mode')
        }
        renameKey(urlConfig, 's', 'subnets')
        if (urlConfig['config_version'] === '1') {
            // Version 1 Configs used full subnet strings as keys and just shortned the _note->_n and _color->_c keys
            expandKeys(urlConfig['subnets'])
        } else if (urlConfig['config_version'] === '2') {
            // Version 2 Configs uses the Nth Position representation for subnet keys and requires the base_network
            // option. It also uses n/c for note/color
            if (urlConfig.hasOwnProperty('b')) {
                renameKey(urlConfig, 'b', 'base_network')
            }
            let expandedSubnetMap = {};
            expandSubnetMap(expandedSubnetMap, urlConfig['subnets'], urlConfig['base_network'])
            urlConfig['subnets'] = expandedSubnetMap
        }
        importConfig(urlConfig)

        // Clean up the URL after processing the shared link
        // This removes the ugly compressed parameter while keeping the state in history
        if (window.history.replaceState) {
            const cleanUrl = window.location.pathname;
            window.history.replaceState(exportConfig(false), '', cleanUrl);
        }

        return true
    }
}

function minifySubnetMap(minifiedMap, referenceMap, baseNetwork) {
    for (let subnet in referenceMap) {
        if (subnet.startsWith('_')) continue;

        const nthRepresentation = getNthSubnet(baseNetwork, subnet);
        minifiedMap[nthRepresentation] = {}
        if (referenceMap[subnet].hasOwnProperty('_note')) {
            minifiedMap[nthRepresentation]['n'] = referenceMap[subnet]['_note']
        }
        if (referenceMap[subnet].hasOwnProperty('_color')) {
            minifiedMap[nthRepresentation]['c'] = referenceMap[subnet]['_color']
        }
        if (Object.keys(referenceMap[subnet]).some(key => !key.startsWith('_'))) {
            minifySubnetMap(minifiedMap[nthRepresentation], referenceMap[subnet], baseNetwork);
        }
    }
}

function expandSubnetMap(expandedMap, miniMap, baseNetwork) {
    for (let mapKey in miniMap) {
        if (mapKey === 'n' || mapKey === 'c') {
            continue;
        }
        let subnetKey = getSubnetFromNth(baseNetwork, mapKey)
        expandedMap[subnetKey] = {}
        if (has_network_sub_keys(miniMap[mapKey])) {
            expandSubnetMap(expandedMap[subnetKey], miniMap[mapKey], baseNetwork)
        } else {
            if (miniMap[mapKey].hasOwnProperty('n')) {
                expandedMap[subnetKey]['_note'] = miniMap[mapKey]['n']
            }
            if (miniMap[mapKey].hasOwnProperty('c')) {
                expandedMap[subnetKey]['_color'] = miniMap[mapKey]['c']
            }
        }
    }
}

// For Config Version 1 Backwards Compatibility
function expandKeys(subnetTree) {
    for (let mapKey in subnetTree) {
        if (mapKey.startsWith('_')) {
            continue;
        }
        if (has_network_sub_keys(subnetTree[mapKey])) {
            expandKeys(subnetTree[mapKey])
        } else {
            if (subnetTree[mapKey].hasOwnProperty('_n')) {
                renameKey(subnetTree[mapKey], '_n', '_note')
            }
            if (subnetTree[mapKey].hasOwnProperty('_c')) {
                renameKey(subnetTree[mapKey], '_c', '_color')
            }

        }
    }
}

function renameKey(obj, oldKey, newKey) {
    if (oldKey !== newKey) {
    Object.defineProperty(obj, newKey,
        Object.getOwnPropertyDescriptor(obj, oldKey));
        delete obj[oldKey];
    }
}

function importConfig(text) {
    if (text['config_version'] === '1') {
        var [subnetNet, subnetSize] = Object.keys(text['subnets'])[0].split('/')
    } else if (text['config_version'] === '2') {
        var [subnetNet, subnetSize] = text['base_network'].split('/')
    }
    $('#network').val(subnetNet)
    $('#netsize').val(subnetSize)
    maxNetSize = subnetSize
    subnetMap = sortIPCIDRs(text['subnets']);
    operatingMode = text['operating_mode'] || 'Standard'
    switchMode(operatingMode);

}

function sortIPCIDRs(obj) {
  // Base case: if the value is an empty object, return it
  if (typeof obj === 'object' && Object.keys(obj).length === 0) {
    return {};
  }

  // Separate CIDR entries from metadata
  const entries = Object.entries(obj);
  const cidrEntries = entries.filter(([key]) => !key.startsWith('_'));
  const metadataEntries = entries.filter(([key]) => key.startsWith('_'));

  // Sort CIDR entries by IP address
  const sortedCIDREntries = cidrEntries.sort((a, b) => {
    const ipA = a[0].split('/')[0].split('.').map(Number);
    const ipB = b[0].split('/')[0].split('.').map(Number);

    for (let i = 0; i < 4; i++) {
      if (ipA[i] !== ipB[i]) {
        return ipA[i] - ipB[i];
      }
    }
    return 0;
  });

  // Create sorted object, starting with metadata
  const sortedObj = {};

  // Add sorted CIDR entries with recursion
  for (const [key, value] of sortedCIDREntries) {
    sortedObj[key] = typeof value === 'object' ? sortIPCIDRs(value) : value;
  }

  // Add metadata entries (unsorted, as they appeared in original)
  for (const [key, value] of metadataEntries) {
    sortedObj[key] = value;
  }

  return sortedObj;
}

const rgba2hex = (rgba) => `#${rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/).slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`

// Auto-Allocation Functions
function parseSubnetSize(input) {
    // Parse and validate subnet size input
    // Accepts: empty, "0", "/0", "9"-"32", "/9"-"/32"
    // Returns: number (9-32) or null for empty/0

    if (!input || input.trim() === '') {
        return null;
    }

    const trimmed = input.trim();

    // Handle 0 and /0 specially
    if (trimmed === '0' || trimmed === '/0') {
        return null;
    }

    let size = null;

    // Check for /XX format
    if (trimmed.startsWith('/')) {
        const numPart = trimmed.substring(1);
        // Check if rest is a valid number
        if (!/^\d+$/.test(numPart)) {
            return 'invalid';
        }
        size = parseInt(numPart);
    } else {
        // Just a number - check it's all digits
        if (!/^\d+$/.test(trimmed)) {
            return 'invalid';
        }
        size = parseInt(trimmed);
    }

    // Validate it's in valid range
    if (size < 9 || size > 32) {
        return 'invalid';
    }

    return size;
}

function isValidSubnetAlignment(networkAddr, netSize) {
    // Check if a network address is properly aligned for its size
    const ipInt = ip2int(networkAddr);
    const blockSize = Math.pow(2, 32 - netSize);
    return (ipInt % blockSize) === 0;
}

function getNextAlignedSubnet(currentAddr, netSize, alignToSize) {
    // Find the next properly aligned subnet address
    const ipInt = ip2int(currentAddr);
    const blockSize = Math.pow(2, 32 - netSize);
    const alignBlockSize = Math.pow(2, 32 - alignToSize);

    // Align to the larger of the two block sizes
    const alignmentSize = Math.max(blockSize, alignBlockSize);

    // Calculate next aligned address
    const aligned = Math.ceil(ipInt / alignmentSize) * alignmentSize;

    return int2ip(aligned);
}

function calculateReservedSpace(baseNetwork, baseNetSize, reserveSize) {
    // Calculate the starting point after reserving space at the end
    const baseAddr = ip2int(baseNetwork);
    const totalAddresses = Math.pow(2, 32 - baseNetSize);
    const reserveAddresses = Math.pow(2, 32 - reserveSize);

    // Return the last address before reserved space
    return baseAddr + totalAddresses - reserveAddresses;
}


function parseSubnetRequests(requestText, sortOrder = 'preserve') {
    // Parse the subnet requests from the textarea
    const lines = requestText.trim().split('\n');
    const requests = [];
    const errors = [];

    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        if (trimmed === '') continue;

        // Parse format: "name /size" or "name size"
        const match = trimmed.match(/^(.+?)\s+\/?(\d+)$/);
        if (match) {
            const name = match[1].trim();
            const size = parseInt(match[2]);
            if (size < 9 || size > 32) {
                errors.push(`${name}: Invalid subnet size /${size} (must be /9 to /32)`);
            } else {
                requests.push({
                    name: name,
                    size: size
                });
            }
        } else {
            errors.push(`Line ${i + 1}: Invalid format "${trimmed}" (use "name /size" or "name size")`);
        }
    }

    // Return errors if any
    if (errors.length > 0) {
        return { errors: errors };
    }

    // Apply sorting based on sortOrder parameter
    switch (sortOrder) {
        case 'alphabetical':
            // Sort alphabetically by name
            requests.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'optimal':
            // Sort by size (largest first) for optimal packing
            // This helps reduce fragmentation by allocating large subnets first
            requests.sort((a, b) => a.size - b.size);
            break;
        case 'preserve':
        default:
            // Keep original order - do not sort
            break;
    }

    // Don't consolidate here - this is for user requests, not allocations with spare subnets
    return requests;
}

$('#btn_auto_allocate').on('click', function() {
    const baseNetwork = $('#network').val();
    const baseNetSize = parseInt($('#netsize').val());
    const reserveSpaceText = $('#reserveSpace').val();
    const futureSubnetText = $('#futureSubnetSize').val();
    const subnetRequestsText = $('#subnetRequests').val();
    const sortOrder = $('#sortOrder').val();
    const alignLargeOnly = $('#alignLargeOnly').is(':checked');

    // Parse and validate inputs
    const paddingSize = parseSubnetSize(reserveSpaceText);
    const alignToSize = parseSubnetSize(futureSubnetText);

    // Check for validation errors
    if (paddingSize === 'invalid') {
        $('#allocation_results').html('<div class="alert alert-danger">Invalid padding size. Use empty, 0, /0, or /9 through /32</div>');
        return;
    }

    if (alignToSize === 'invalid') {
        $('#allocation_results').html('<div class="alert alert-danger">Invalid alignment size. Use empty, 0, /0, or /9 through /32</div>');
        return;
    }

    const subnetRequests = parseSubnetRequests(subnetRequestsText, sortOrder);

    // Check if parsing returned errors
    if (subnetRequests.errors) {
        let errorHtml = '<div class="alert alert-danger"><strong>Subnet Requirements Errors:</strong><ul class="mb-0">';
        for (const error of subnetRequests.errors) {
            errorHtml += `<li>${error}</li>`;
        }
        errorHtml += '</ul></div>';
        $('#allocation_results').html(errorHtml);
        return;
    }

    if (subnetRequests.length === 0) {
        $('#allocation_results').html('<div class="alert alert-warning">Please enter subnet requirements</div>');
        return;
    }

    // First, ensure we have a completely clean base network
    // Force a full reset by clearing the subnet map first
    subnetMap = {};
    $('#btn_go').click();

    // Wait a moment for the reset to complete
    setTimeout(function() {
        try {
            let rootNetwork = get_network(baseNetwork, baseNetSize);
            let rootCidr = `${rootNetwork}/${baseNetSize}`;

        // Calculate available space
        let currentAddrInt = ip2int(rootNetwork);
        let endAddr = currentAddrInt + Math.pow(2, 32 - baseNetSize);

        // Allocate subnets
        let allocations = [];
        let allocationErrors = [];

        // alignToSize is already parsed and validated above
        const alignmentSize = alignToSize;

        for (let requestIndex = 0; requestIndex < subnetRequests.length; requestIndex++) {
            const request = subnetRequests[requestIndex];
            // Determine alignment size based on settings
            let effectiveAlignSize = request.size; // Default to natural alignment

            if (alignmentSize) {
                if (alignLargeOnly) {
                    // Only apply alignment to subnets that are >= alignment size (smaller CIDR number)
                    if (request.size <= alignmentSize) {
                        // Subnet is large enough, apply alignment
                        effectiveAlignSize = alignmentSize;
                    }
                    // Otherwise use natural alignment (effectiveAlignSize stays as request.size)
                } else {
                    // Apply alignment to all subnets
                    effectiveAlignSize = alignmentSize;
                }
            }

            // For the first subnet or after handling padding/alignment, ensure we're properly aligned
            // This handles the case where the current position isn't aligned for this subnet
            if (!isValidSubnetAlignment(int2ip(currentAddrInt), effectiveAlignSize)) {
                const alignedAddr = getNextAlignedSubnet(int2ip(currentAddrInt), effectiveAlignSize, effectiveAlignSize);
                const alignedAddrInt = ip2int(alignedAddr);

                // If there's a gap due to alignment, fill it with spare subnets
                if (alignedAddrInt > currentAddrInt) {
                    // Fill the gap with properly-sized spare subnets
                    let gapStart = currentAddrInt;

                    while (gapStart < alignedAddrInt) {
                        // Find the largest power-of-2 aligned subnet that fits in the remaining gap
                        let maxSize = 32;

                        // Check alignment - the subnet must be aligned to its size
                        for (let testSize = 1; testSize <= 32; testSize++) {
                            const blockSize = Math.pow(2, 32 - testSize);
                            // Check if this size would fit and is properly aligned
                            if (gapStart % blockSize === 0 && gapStart + blockSize <= alignedAddrInt) {
                                maxSize = testSize;
                                break;
                            }
                        }

                        const blockSize = Math.pow(2, 32 - maxSize);
                        allocations.push({
                            name: '(spare)',
                            network: int2ip(gapStart),
                            size: maxSize,
                            cidr: `${int2ip(gapStart)}/${maxSize}`
                        });

                        gapStart += blockSize;
                    }
                }

                currentAddrInt = alignedAddrInt;
            }

            // Check if we have enough space
            const subnetSize = Math.pow(2, 32 - request.size);
            if (currentAddrInt + subnetSize > endAddr) {
                allocationErrors.push(`Not enough space for ${request.name} /${request.size}`);
                continue;
            }

            // Record the allocation
            allocations.push({
                name: request.name,
                network: int2ip(currentAddrInt),
                size: request.size,
                cidr: `${int2ip(currentAddrInt)}/${request.size}`
            });

            // Move to next available address
            currentAddrInt += subnetSize;

            // Handle padding and alignment for the next subnet (except after the last subnet)
            if (requestIndex < subnetRequests.length - 1) {
                const nextRequest = subnetRequests[requestIndex + 1];
                let nextEffectiveAlignSize = nextRequest.size; // Default alignment

                // Determine alignment for the next subnet
                if (alignmentSize) {
                    if (alignLargeOnly) {
                        if (nextRequest.size <= alignmentSize) {
                            nextEffectiveAlignSize = alignmentSize;
                        }
                    } else {
                        nextEffectiveAlignSize = alignmentSize;
                    }
                }

                // Calculate where we need to be for the next subnet
                let targetAddr = currentAddrInt;

                // Add padding if requested
                if (paddingSize) {
                    const paddingBlockSize = Math.pow(2, 32 - paddingSize);
                    targetAddr += paddingBlockSize;
                }

                // Align to the next subnet's boundary
                if (!isValidSubnetAlignment(int2ip(targetAddr), nextEffectiveAlignSize)) {
                    const alignedAddr = getNextAlignedSubnet(int2ip(targetAddr), nextEffectiveAlignSize, nextEffectiveAlignSize);
                    targetAddr = ip2int(alignedAddr);
                }

                // Create spare block(s) to fill the gap from current position to target
                if (targetAddr > currentAddrInt) {
                    let gapStart = currentAddrInt;

                    while (gapStart < targetAddr) {
                        // Find the largest properly-aligned subnet that fits
                        let bestSize = 32;

                        for (let testSize = 1; testSize <= 32; testSize++) {
                            const blockSize = Math.pow(2, 32 - testSize);
                            // Check if aligned and fits
                            if (gapStart % blockSize === 0 && gapStart + blockSize <= targetAddr) {
                                bestSize = testSize;
                                break;
                            }
                        }

                        const blockSize = Math.pow(2, 32 - bestSize);
                        allocations.push({
                            name: '(spare)',
                            network: int2ip(gapStart),
                            size: bestSize,
                            cidr: `${int2ip(gapStart)}/${bestSize}`
                        });

                        gapStart += blockSize;
                    }

                    currentAddrInt = targetAddr;
                }
            }
        }

        // Don't consolidate spare allocations - keep them as intended for padding

        // Display results
        let resultsHtml = '';

        if (allocations.length > 0) {
            resultsHtml += '<div class="alert alert-success"><h6>Allocated Subnets:</h6><ul class="mb-0">';
            for (const alloc of allocations) {
                resultsHtml += `<li><strong>${alloc.name}:</strong> ${alloc.cidr}</li>`;
            }
            resultsHtml += '</ul></div>';

            // Now perform the actual splitting in the visual calculator
            // Simplified approach: just split recursively until we have all needed subnets

            function performAllocationSplits() {
                // Keep splitting until all allocations exist
                let maxIterations = 50;
                let allFound = false;

                while (!allFound && maxIterations-- > 0) {
                    allFound = true;

                    for (const alloc of allocations) {
                        // Check if this allocation's subnet exists
                        if (!findSubnetInTree(alloc.cidr, subnetMap)) {
                            allFound = false;

                            // Find the smallest parent that exists and split it
                            for (let parentSize = alloc.size - 1; parentSize >= baseNetSize; parentSize--) {
                                const parentNet = get_network(alloc.network, parentSize);
                                const parentCidr = `${parentNet}/${parentSize}`;

                                if (findAndSplitIfNeeded(parentCidr, subnetMap)) {
                                    break; // Split successful, move to next iteration
                                }
                            }
                        }
                    }
                }

                function findSubnetInTree(cidr, tree) {
                    for (let key in tree) {
                        if (key === cidr) return true;
                        if (typeof tree[key] === 'object' && !key.startsWith('_')) {
                            if (findSubnetInTree(cidr, tree[key])) return true;
                        }
                    }
                    return false;
                }

                function findAndSplitIfNeeded(cidr, tree) {
                    for (let key in tree) {
                        if (key === cidr && !has_network_sub_keys(tree[key])) {
                            mutate_subnet_map('split', key, '');
                            return true;
                        }
                        if (typeof tree[key] === 'object' && !key.startsWith('_')) {
                            if (findAndSplitIfNeeded(cidr, tree[key])) return true;
                        }
                    }
                    return false;
                }
            }

            // Perform all the splits
            performAllocationSplits();

            // Re-render the table
            renderTable(operatingMode);

            // Don't update the textarea - keep the original user requests
            // This prevents spare subnets from being treated as requests on subsequent clicks

            // Now add the notes to the correct subnets
            // We need to do this AFTER rendering to ensure all subnets exist
            setTimeout(function() {
                // Clear any existing notes first to avoid duplicates
                $('input.form-control[data-subnet]').each(function() {
                    const subnet = $(this).attr('data-subnet');
                    // Only clear if this subnet is one we're allocating
                    if (allocations.find(a => a.cidr === subnet)) {
                        $(this).val('');
                        mutate_subnet_map('note', subnet, '', '');
                    }
                });

                // Now add the correct notes
                for (const alloc of allocations) {
                    // Set the note directly in the subnet map
                    mutate_subnet_map('note', alloc.cidr, '', alloc.name);
                }

                // Re-render to show the notes
                renderTable(operatingMode);
            }, 200);
        }

        if (allocationErrors.length > 0) {
            resultsHtml += '<div class="alert alert-danger"><h6>Errors:</h6><ul class="mb-0">';
            for (const error of allocationErrors) {
                resultsHtml += `<li>${error}</li>`;
            }
            resultsHtml += '</ul></div>';
        }

        $('#allocation_results').html(resultsHtml);
        } catch (error) {
            console.error('Auto-allocation error:', error);
            $('#allocation_results').html('<div class="alert alert-danger">An error occurred during allocation: ' + error.message + '</div>');
        }
    }, 100);
});

$('#btn_validate_alignment').on('click', function() {
    // Validate existing subnets for alignment issues
    const issues = [];
    const warnings = [];
    let totalSubnets = 0;
    let totalHosts = 0;
    let totalUnused = 0;

    // Get base network info
    const baseNetwork = $('#network').val();
    const baseNetSize = parseInt($('#netsize').val());
    const baseNetworkAddr = get_network(baseNetwork, baseNetSize);
    const baseNetworkInt = ip2int(baseNetworkAddr);
    const baseTotalSize = Math.pow(2, 32 - baseNetSize);

    // Track allocated space
    const allocatedRanges = [];

    // Check all subnets in the map
    function checkSubnets(subnetTree, depth = 0) {
        for (let mapKey in subnetTree) {
            if (mapKey.startsWith('_')) continue;

            const [network, size] = mapKey.split('/');
            const netSize = parseInt(size);

            // Only check leaf nodes (actual allocated subnets)
            if (!has_network_sub_keys(subnetTree[mapKey])) {
                totalSubnets++;
                const subnetHosts = Math.pow(2, 32 - netSize);
                totalHosts += subnetHosts;

                // Check if this subnet is properly aligned
                if (!isValidSubnetAlignment(network, netSize)) {
                    issues.push(`${mapKey} is not properly aligned - invalid subnet boundary`);
                }

                // Track this allocation
                allocatedRanges.push({
                    start: ip2int(network),
                    end: ip2int(network) + subnetHosts - 1,
                    cidr: mapKey,
                    size: netSize
                });
            }

            // Recurse if there are sub-networks
            if (has_network_sub_keys(subnetTree[mapKey])) {
                checkSubnets(subnetTree[mapKey], depth + 1);
            }
        }
    }

    checkSubnets(subnetMap);

    // Sort allocated ranges
    allocatedRanges.sort((a, b) => a.start - b.start);

    // Check for gaps and overlaps
    for (let i = 0; i < allocatedRanges.length; i++) {
        if (i > 0) {
            const prevEnd = allocatedRanges[i - 1].end;
            const currStart = allocatedRanges[i].start;

            if (currStart <= prevEnd) {
                issues.push(`Overlap detected: ${allocatedRanges[i - 1].cidr} overlaps with ${allocatedRanges[i].cidr}`);
            } else if (currStart > prevEnd + 1) {
                const gapSize = currStart - prevEnd - 1;
                const gapStart = int2ip(prevEnd + 1);
                const gapEnd = int2ip(currStart - 1);
                warnings.push(`Gap of ${gapSize} addresses between ${allocatedRanges[i - 1].cidr} and ${allocatedRanges[i].cidr} (${gapStart} - ${gapEnd})`);
                totalUnused += gapSize;
            }
        }
    }

    // Calculate total unused space
    const totalAllocated = totalHosts;
    totalUnused = baseTotalSize - totalAllocated;
    const utilizationPercent = ((totalAllocated / baseTotalSize) * 100).toFixed(1);

    // Display validation results
    let resultsHtml = '<div class="alert alert-info"><h6>Network Analysis:</h6>';
    resultsHtml += `<ul class="mb-0">`;
    resultsHtml += `<li><strong>Total Subnets:</strong> ${totalSubnets}</li>`;
    resultsHtml += `<li><strong>Total Allocated:</strong> ${totalAllocated} addresses (${utilizationPercent}%)</li>`;
    resultsHtml += `<li><strong>Total Available:</strong> ${totalUnused} addresses</li>`;
    resultsHtml += `</ul></div>`;

    if (issues.length === 0 && warnings.length === 0) {
        resultsHtml += '<div class="alert alert-success">All subnets are properly aligned with no gaps!</div>';
    } else {
        if (issues.length > 0) {
            resultsHtml += '<div class="alert alert-danger"><h6>Issues Found:</h6><ul class="mb-0">';
            for (const issue of issues) {
                resultsHtml += `<li>${issue}</li>`;
            }
            resultsHtml += '</ul></div>';
        }
        if (warnings.length > 0) {
            resultsHtml += '<div class="alert alert-warning"><h6>Gaps Detected:</h6><ul class="mb-0">';
            for (const warning of warnings) {
                resultsHtml += `<li>${warning}</li>`;
            }
            resultsHtml += '</ul></div>';
        }
    }

    $('#allocation_results').html(resultsHtml);
});
