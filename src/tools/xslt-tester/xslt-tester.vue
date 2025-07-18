<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { XmlParser, Xslt } from 'xslt-processor';
import { formatXml } from '../xml-formatter/xml-formatter.service';
import { useValidation } from '@/composable/validation';

const { t } = useI18n();

const xslt = ref(`<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
  <html>
  <body>
    <h2>{{ t('tools.xslt-tester.texts.tag-my-cd-collection') }}</h2>
    <table border="1">
      <tr bgcolor="#9acd32">
        <th>{{ t('tools.xslt-tester.texts.tag-title') }}</th>
        <th>{{ t('tools.xslt-tester.texts.tag-artist') }}</th>
      </tr>
      <tr>
        <td>{{ t('tools.xslt-tester.texts.tag-') }}</td>
        <td>{{ t('tools.xslt-tester.texts.tag-') }}</td>
      </tr>
    </table>
  </body>
  </html>
</xsl:template>
</xsl:stylesheet>`);
const xmlInput = ref(`<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <cd>
    <title>{{ t('tools.xslt-tester.texts.tag-empire-burlesque') }}</title>
    <artist>{{ t('tools.xslt-tester.texts.tag-bob-dylan') }}</artist>
    <country>{{ t('tools.xslt-tester.texts.tag-usa') }}</country>
    <company>{{ t('tools.xslt-tester.texts.tag-columbia') }}</company>
    <price>{{ t('tools.xslt-tester.texts.tag-10-90') }}</price>
    <year>{{ t('tools.xslt-tester.texts.tag-1985') }}</year>
  </cd>
  <cd>
    <title>{{ t('tools.xslt-tester.texts.tag-hide-your-heart') }}</title>
    <artist>{{ t('tools.xslt-tester.texts.tag-bonnie-tyler') }}</artist>
    <country>{{ t('tools.xslt-tester.texts.tag-uk') }}</country>
    <company>{{ t('tools.xslt-tester.texts.tag-cbs-records') }}</company>
    <price>{{ t('tools.xslt-tester.texts.tag-9-90') }}</price>
    <year>{{ t('tools.xslt-tester.texts.tag-1988') }}</year>
  </cd>
</catalog>`);

const formatted = ref(false);
const xmlOutput = computedAsync(async () => {
  const xmlString = xmlInput.value;
  const xsltString = xslt.value;
  const formatResult = formatted.value;

  const xsltProcessor = new Xslt();
  const xmlParser = new XmlParser();

  try {
    let xmlOutput = await xsltProcessor.xsltProcess(
      xmlParser.xmlParse(xmlString),
      xmlParser.xmlParse(xsltString),
    );
    if (formatResult) {
      xmlOutput = formatXml(xmlOutput);
    }
    return xmlOutput;
  }
  catch (e: any) {
    return e.toString();
  }
});

const xsltValidation = useValidation({
  source: xslt,
  rules: [
    {
      validator: (v) => {
        const xmlParser = new XmlParser();
        xmlParser.xmlParse(v);
        return true;
      },
      message: t('tools.xslt-tester.texts.message-provided-xslt-is-not-valid'),
    },
  ],
});
const xmlInputValidation = useValidation({
  source: xmlInput,
  rules: [
    {
      validator: (v) => {
        const xmlParser = new XmlParser();
        xmlParser.xmlParse(v);
        return true;
      },
      message: t('tools.xslt-tester.texts.message-provided-xml-is-not-valid'),
    },
  ],
});
</script>

<template>
  <div>
    <c-card :title="t('tools.xslt-tester.texts.title-input')" mb-2>
      <c-input-text
        v-model:value="xslt"
        :label="t('tools.xslt-tester.texts.label-xlst')"
        multiline
        :placeholder="t('tools.xslt-tester.texts.placeholder-put-your-xslt-here')"
        rows="5"
        :validation="xsltValidation"
        mb-2
      />

      <c-input-text
        v-model:value="xmlInput"
        :label="t('tools.xslt-tester.texts.label-xml')"
        multiline
        :placeholder="t('tools.xslt-tester.texts.placeholder-put-your-xml-here')"
        rows="5"
        :validation="xmlInputValidation"
        mb-2
      />

      <n-checkbox v-model:checked="formatted">
        {{ t('tools.xslt-tester.texts.tag-format-xml-output') }}
      </n-checkbox>
    </c-card>

    <c-card :title="t('tools.xslt-tester.texts.title-output')">
      <TextareaCopyable :value="xmlOutput" language="xml" />
    </c-card>
  </div>
</template>
