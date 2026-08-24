<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { xHtml } from './objgen-html.service';

const { t } = useI18n();

const defaultValue = `// This is a comment!
// HTML generator quick tips:
// - Each line with content will generate a HTML element
// - Generate elements by just using their tag names
// - Elements are nested using tabs and/or spaces
// - Element content (inner text) is specified using an equal sign '='
// - Specify one or more class attributes after the tag name
// - Class names can optionally be indicated using a dot prefix, '.some-class'
// - Element ids are assigned using a hash prefix, '#someElementId'
// - Assign attributes using a name=val enclosed in parens, '(attr="value")'
// - Comments in the model text, like this are ignored

// Demo using Bootstrap 4 styled elements
container-fluid
  h2=HTML Generator Demo
  p=The HTML Live Generator uses a shorthand syntax for quickly prototyping and generating HTML snippets. ObjGen includes support for styling elements using the Bootstrap v4.x toolkit and is used in this demo example.
  a(href="https://getbootstrap.com" target="_blank")=Click here for Bootstrap documentation and reference
  hr

  h3 pb-3=Typography
  row
    col bg-light border rounded p-2
      h1 = h1. Bootstrap Heading
      h2 = h2. Bootstrap Heading
      h3 = h3. Bootstrap Heading

  h3 pt-4=Grid Layout
  row mb-3
    col bg-light border
      p-3 = 1 of 2
    col bg-light border
      p-3 = 2 of 2
  row
    col bg-light border
      p-3 = 1 of 3
    col bg-light border
      p-3 = 2 of 3
    col bg-light border
      p-3 = 3 of 3

  h3 pt-4=Flex Layout
  d-flex bg-light #flexDemoContainer
    mr-auto p-2 border=1 of 3
    p-2 border=2 of 3
    p-2 border=3 of 3

  h3 pt-4=Forms
    small=(Login Form)
  row
    col
      form bg-light border rounded p-3
        form-group
          label=Email
          input form-control (type="email", placeholder="someone@example.com")
        form-group
          label=Password
          input form-control (type="password", placeholder="********")
        form-group form-check
          input form-check-input (type="checkbox")
          label form-check-label=Remember me
        button btn btn-primary(type="button")=Submit

  h3 pt-4=Cards
    small=(with decks)
  card-deck
    card
      img card-img-top(src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png")
      card-body
        h5 card-title=Card 1 Title
        p=Card 1 Content
      card-footer
        small text-muted=Last updated 5 mins ago
    card
      img card-img-top(src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png")
      card-body
        h5 card-title=Card 2 Title
        p=Card 2 Content
      card-footer
        small text-muted=Last updated 5 mins ago
    card
      img card-img-top(src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png")
      card-body
        h5 card-title=Card 3 Title
        p=Card 3 Content
      card-footer
        small text-muted=Last updated 5 mins ago

  h2 pt-4=List Group
    small=(with badges)

  ul list-group
    li list-group-item d-flex justify-content-between align-items-center active=Item 1
      span badge badge-danger badge-pill=100
    li list-group-item d-flex justify-content-between align-items-center=Item 2
      span badge badge-primary badge-pill=75
    li list-group-item=Item 3
    li list-group-item=Item 4

  h2 pt-4=Tables

  table .table table-bordered
    thead thead-light
      tr
        th=ID
        th=First
        th=Last
        th=Email
    tbody
      tr
        td=1
        td=John
        td=Doe
        td=john.doe@example.com
      tr
        td=2
        td=Jane
        td=Doe
        td=jane.doe@example.com
      tr
        td=3
        td=Dave
        td=Kingman
        td=dave@davekingman.com

  h2 mt-4=Alerts
  alert alert-primary mt-3 mb-3=Primary Alert
  alert alert-secondary mt-3 mb-3=Secondary Alert
  alert alert-success mt-3 mb-3=Success! Thank you for viewing this demo!
`;

function transformer(value: string) {
  try {
    return xHtml(value);
  }
  catch (e: any) {
    return `/* ERROR: ${e.toString()} */`;
  }
}
</script>

<template>
  <details mb-1>
    <summary>{{ t('tools.objgen-html.texts.tag-documentation') }}</summary>
    <textarea-copyable :value="defaultValue" language="toml" />
  </details>

  <format-transformer
    :input-label="t('tools.objgen-html.texts.input-label-objgen-html-definition')"
    :input-default="defaultValue"
    :input-placeholder="t('tools.objgen-html.texts.input-placeholder-put-your-objgen-html-definition-here')"
    :output-label="t('tools.objgen-html.texts.output-label-generated-html')"
    output-language="html"
    :transformer="transformer"
    download-file-name="output.html"
  />
</template>
