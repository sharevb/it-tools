<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { parseDmarcReportFromEmail, parseDmarcReportsFromXml } from 'dmarc-report-parser';

const { t } = useI18n();

const inputType = ref<'file' | 'content'>('file');
const emailContent = ref('');
const fileInput = ref() as Ref<File | null>;
const error = ref('');

function readAsText(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result?.toString() ?? '');
    reader.onerror = error => reject(error);
  });
}

const parsedReport = computedAsync(async () => {
  const emailContentValue = emailContent.value;
  const file = fileInput.value;
  error.value = '';
  try {
    if (inputType.value === 'file' && file) {
      return await parseDmarcReportsFromXml([await readAsText(file)]);
    }
    else if (inputType.value === 'content' && emailContentValue) {
      return await parseDmarcReportFromEmail(emailContentValue);
    }
    else {
      return null;
    }
  }
  catch (e: any) {
    error.value = e.toString();
    return null;
  }
});

function onUpload(file: File) {
  if (file) {
    fileInput.value = file;
  }
}

const inputLabelAlignmentConfig = {
  labelPosition: 'left',
  labelWidth: '120px',
  labelAlign: 'right',
};

function toDate(dt: number | undefined) {
  if (!dt) {
    return 'NA';
  }
  return (new Date(dt)).toString();
}

function policyResultClass(policyResult: string) {
  if (policyResult === 'pass') {
    return 'ok';
  }
  if (policyResult === 'fail') {
    return 'nok';
  }
  return 'none';
}
</script>

<template>
  <div>
    <c-card :title="t('tools.dmarc-report-analyzer.texts.title-input')" mb-2>
      <n-radio-group v-model:value="inputType" name="radiogroup" mb-2 flex justify-center>
        <n-space>
          <n-radio
            value="file"
            :label="t('tools.dmarc-report-analyzer.texts.label-dmarc-xml-file')"
          />
          <n-radio
            value="content"
            :label="t('tools.dmarc-report-analyzer.texts.label-eml-content')"
          />
        </n-space>
      </n-radio-group>

      <c-file-upload
        v-if="inputType === 'file'"
        :title="t('tools.dmarc-report-analyzer.texts.title-drag-and-drop-dmarc-xml-report-file-here-or-click-to-select-a-file')"
        @file-upload="onUpload"
      />

      <c-input-text
        v-if="inputType === 'content'"
        v-model:value="emailContent"
        :label="t('tools.dmarc-report-analyzer.texts.label-raw-email-content')"
        multiline
        :placeholder="t('tools.dmarc-report-analyzer.texts.placeholder-put-your-eml-email-content-here')"
        rows="15"
        mb-2
      />
    </c-card>

    <c-alert v-if="error">
      {{ error }}
    </c-alert>

    <c-card v-if="!error && parsedReport" :title="t('tools.dmarc-report-analyzer.texts.title-output')">
      <input-copyable v-if="fileInput?.name" :label="t('tools.dmarc-report-analyzer.texts.label-file-name')" :value="fileInput?.name" />

      <c-card
        v-for="(report, reportIndex) in parsedReport.reports || []"
        :key="reportIndex" :title="`${report.reportMetadata?.orgName} (${report.reportMetadata?.reportId})`"
      >
        <input-copyable v-bind="inputLabelAlignmentConfig" mb-1 :label="t('tools.dmarc-report-analyzer.texts.label-orgname')" :value="report.reportMetadata?.orgName" />
        <input-copyable v-bind="inputLabelAlignmentConfig" mb-1 :label="t('tools.dmarc-report-analyzer.texts.label-email')" :value="report.reportMetadata?.email" />
        <input-copyable v-bind="inputLabelAlignmentConfig" mb-1 :label="t('tools.dmarc-report-analyzer.texts.label-extracontactinfo')" :value="report.reportMetadata?.extraContactInfo" />
        <input-copyable v-bind="inputLabelAlignmentConfig" mb-1 :label="t('tools.dmarc-report-analyzer.texts.label-reportid')" :value="report.reportMetadata?.reportId" />
        <input-copyable v-bind="inputLabelAlignmentConfig" mb-1 :label="t('tools.dmarc-report-analyzer.texts.label-date-begin')" :value="toDate(report.reportMetadata?.dateRange?.begin)" />
        <input-copyable v-bind="inputLabelAlignmentConfig" mb-1 :label="t('tools.dmarc-report-analyzer.texts.label-date-end')" :value="toDate(report.reportMetadata?.dateRange?.end)" />
        <input-copyable v-bind="inputLabelAlignmentConfig" mb-1 :label="t('tools.dmarc-report-analyzer.texts.label-domain')" :value="report.policyPublished?.domain" />
        <c-card :title="t('tools.dmarc-report-analyzer.texts.title-policy-published')" mb-2>
          <textarea-copyable :value="JSON.stringify(report.policyPublished, null, 2)" />
        </c-card>

        <c-card :title="t('tools.dmarc-report-analyzer.texts.title-failures')" mt-2>
          <n-table>
            <thead>
              <tr>
                <th>{{ t('tools.dmarc-report-analyzer.texts.tag-source-ip') }}</th>
                <th>{{ t('tools.dmarc-report-analyzer.texts.tag-email-volume') }}</th>
                <th>{{ t('tools.dmarc-report-analyzer.texts.tag-dmarc-policy') }}</th>
                <th>{{ t('tools.dmarc-report-analyzer.texts.tag-dkim-policy') }}</th>
                <th>{{ t('tools.dmarc-report-analyzer.texts.tag-spf-policy') }}</th>
                <th>{{ t('tools.dmarc-report-analyzer.texts.tag-identifiers') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(record, recordIndex) in report.record || []" :key="recordIndex">
                <td>
                  {{ record.row.sourceIp }}
                </td>
                <td>
                  {{ record.row.count }}
                </td>
                <td>
                  {{ record.row.policyEvaluated.disposition }}
                </td>
                <td>
                  <span :class="policyResultClass(record.row.policyEvaluated.dkim)">{{ record.row.policyEvaluated.dkim }}</span>
                  <br>
                  {{ (record.authResults.dkim || []).map(dkim => `${dkim.domain}: ${dkim.result} ${dkim.humanResult}`.trim()).join(', ') }}
                </td>
                <td>
                  <span :class="policyResultClass(record.row.policyEvaluated.spf)">{{ record.row.policyEvaluated.spf }}</span>
                  <br>
                  {{ (record.authResults.spf || []).map(spf => `${spf.domain}: ${spf.result}`.trim()).join(', ') }}
                </td>
                <td>
                  <textarea-copyable :value="JSON.stringify(record.identifiers, null, 2)" />
                </td>
              </tr>
            </tbody>
          </n-table>
        </c-card>
      </c-card>
    </c-card>
  </div>
</template>

<style scoped>
.ok {
  color: green;
}
.nok {
  color: red;
}
</style>
