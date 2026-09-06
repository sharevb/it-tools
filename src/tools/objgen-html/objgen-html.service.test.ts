import { describe, expect, it } from 'vitest';
import { xHtml } from './objgen-html.service';

describe('objgen-html service', () => {
  describe('xHtml', () => {
    it('generate correct HTML', () => {
      expect(
        xHtml(`// This is a comment!
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
`),
      ).toBe(`  <div class="container-fluid">
    <h2>HTML Generator Demo</h2>
    <p>The HTML Live Generator uses a shorthand syntax for quickly prototyping and generating HTML snippets. ObjGen includes support for styling elements using the Bootstrap v4.x toolkit and is used in this demo example.</p>
    <a href="https://getbootstrap.com" target="_blank">Click here for Bootstrap documentation and reference</a>
    <hr></hr>
    <h3 class="pb-3">Typography</h3>
    <div class="row">
      <div class="col bg-light border rounded p-2">
        <h1>h1. Bootstrap Heading</h1>
        <h2>h2. Bootstrap Heading</h2>
        <h3>h3. Bootstrap Heading</h3>
      </div>
    </div>
    <h3 class="pt-4">Grid Layout</h3>
    <div class="row mb-3">
      <div class="col bg-light border">
        <div class="p-3">1 of 2</div>
      </div>
      <div class="col bg-light border">
        <div class="p-3">2 of 2</div>
      </div>
    </div>
    <div class="row">
      <div class="col bg-light border">
        <div class="p-3">1 of 3</div>
      </div>
      <div class="col bg-light border">
        <div class="p-3">2 of 3</div>
      </div>
      <div class="col bg-light border">
        <div class="p-3">3 of 3</div>
      </div>
    </div>
    <h3 class="pt-4">Flex Layout</h3>
    <div id="flexDemoContainer" class="d-flex bg-light">
      <div class="mr-auto p-2 border">1 of 3</div>
      <div class="p-2 border">2 of 3</div>
      <div class="p-2 border">3 of 3</div>
    </div>
    <h3 class="pt-4">
      Forms
      <small>(Login Form)</small>
    </h3>
    <div class="row">
      <div class="col">
        <form class="bg-light border rounded p-3">
          <div class="form-group">
            <label>Email</label>
            <input class="form-control" type="email", placeholder="someone@example.com"></input>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input class="form-control" type="password", placeholder="********"></input>
          </div>
          <div class="form-group form-check">
            <input class="form-check-input" type="checkbox"></input>
            <label class="form-check-label">Remember me</label>
          </div>
          <button class="btn btn-primary" type="button">Submit</button>
        </form>
      </div>
    </div>
    <h3 class="pt-4">
      Cards
      <small>(with decks)</small>
    </h3>
    <div class="card-deck">
      <div class="card">
        <img class="card-img-top" src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"></img>
        <div class="card-body">
          <h5 class="card-title">Card 1 Title</h5>
          <p>Card 1 Content</p>
        </div>
        <div class="card-footer">
          <small class="text-muted">Last updated 5 mins ago</small>
        </div>
      </div>
      <div class="card">
        <img class="card-img-top" src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"></img>
        <div class="card-body">
          <h5 class="card-title">Card 2 Title</h5>
          <p>Card 2 Content</p>
        </div>
        <div class="card-footer">
          <small class="text-muted">Last updated 5 mins ago</small>
        </div>
      </div>
      <div class="card">
        <img class="card-img-top" src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"></img>
        <div class="card-body">
          <h5 class="card-title">Card 3 Title</h5>
          <p>Card 3 Content</p>
        </div>
        <div class="card-footer">
          <small class="text-muted">Last updated 5 mins ago</small>
        </div>
      </div>
    </div>
    <h2 class="pt-4">
      List Group
      <small>(with badges)</small>
    </h2>
    <ul class="list-group">
      <li class="list-group-item d-flex justify-content-between align-items-center active">
        Item 1
        <span class="badge badge-danger badge-pill">100</span>
      </li>
      <li class="list-group-item d-flex justify-content-between align-items-center">
        Item 2
        <span class="badge badge-primary badge-pill">75</span>
      </li>
      <li class="list-group-item">Item 3</li>
      <li class="list-group-item">Item 4</li>
    </ul>
    <h2 class="pt-4">Tables</h2>
    <table class="table table-bordered">
      <thead class="thead-light">
        <tr>
          <th>ID</th>
          <th>First</th>
          <th>Last</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>John</td>
          <td>Doe</td>
          <td>john.doe@example.com</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Jane</td>
          <td>Doe</td>
          <td>jane.doe@example.com</td>
        </tr>
        <tr>
          <td>3</td>
          <td>Dave</td>
          <td>Kingman</td>
          <td>dave@davekingman.com</td>
        </tr>
      </tbody>
    </table>
    <h2 class="mt-4">Alerts</h2>
    <div class="alert alert-primary mt-3 mb-3">Primary Alert</div>
    <div class="alert alert-secondary mt-3 mb-3">Secondary Alert</div>
    <div class="alert alert-success mt-3 mb-3">Success! Thank you for viewing this demo!</div>
  </div>
`);
    });
  });
});
