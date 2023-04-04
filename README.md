# Lit-based Table Web Component

![](./TableDemoGifMed.gif)


## Using the table component

First, make sure you install the package and its necessary dependencies. Since this project assumes you're using Lit, it expects that to be included by your project. It also expects lit-svelte-stores to be loaded. If you're not using any of those directly, make sure they are set as peer dependencies. Like so:

```
npm add adaburrows/table-web-component
```

If you're not making a component using the scoped registry mixin, then you can import everything you need:

```ts
// This registers the <adaburrows-table> and <adaburrows-table-context> tags globally
import { FieldDefinitions, FieldDefinition, TableStore } from '@adaburrows/table-web-component/global';
```

Otherwise, you can use choose to use the scoped registry mixin:

```ts
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { FieldDefinitions, FieldDefinition, TableStore, Table } from '@adaburrows/table-web-component';
```

If you choose to use the ScopedRegistryHost mixin in your project, make sure you install it and include the polyfill in your index.html or be sure to import it in you top level index.ts beofre you load you own component code:

```
npm add @webcomponents/scoped-custom-element-registry @lit-labs/scoped-registry-mixin
```

```html
<script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"></script>
```

or

```js
import @webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js;
```

Additionally, one can use the library with React by importing the following:

```ts
import { FieldDefinitions, FieldDefinition, TableStore, Table } from '@adaburrows/table-web-component/react';
```

There may be a few issues around using this with React, as the library expects lit-html templates, and not necessarily React components. Since you do have the option to use the `TableStore`, this may not be an issue. Just use the store and the utilities in [`react-store-adaptors`](https://github.com/adaburrows/react-store-adaptors) to build your own table rendering code. See the Headless Usage section for more details.

Then set up the data that will be displayed. In this case, we're just going to show a simple 2 bit truth table.

```ts
/**
 * Here's our data schema
 */
type TwoBits = {
  'b1': number,
  'b0': number
}
```

Now lets define the field definitions we're working with. In this case, it will feel like overkill. That's because our table is almost too simple for all of this machinery.

```ts
/**
 * This is a simple example for a truth table of two bits
 */
const fieldDefs: FieldDefinitions<TwoBits> = {
  'b1': new FieldDefinition<TwoBits>({heading: '2^1'}),
  'b0': new FieldDefinition<TwoBits>({heading: '2^0'})
}
```

Now we can put it all together into a table store:

```ts
  // This means this component we are building will not rerender, but the Table's
  // lit-svelte-stores controller should cause a requestUpdate() call by the
  // component
  tableStore: TableStore<TwoBits>

  constructor() {
    super();
    // Set up an example table
    this.tableStore = new TableStore({
      // This is the Id used to identify the table in the CSS variables and is the table's HTML id
      tableId: 'simple',
      fieldDefs,
      records: [
        { 'b1': 0, 'b0': 0 },
        { 'b1': 0, 'b0': 1 },
        { 'b1': 1, 'b0': 0 },
        { 'b1': 1, 'b0': 1 },
      ],
      showHeader: true
    });
  }
```

Now we can add the render method:

```ts
  render() {
    return html`<adaburrows-table .tableStore=${this.tableStore}></adaburrows-table>`;
  }
```

And just for funsies, let's add some CSS that takes some CSS-variables you can define (or grab from the [test CSS](https://github.com/adaburrows/table-web-component/blob/main/test/index.css)). The table actually generates a bunch of CSS variables that can be specified at any scope above the table component. The variables are all prefixed with `--table-${tableID}-` and end with a description of the part of the table they style. So here we're going to specify a background color, a border style for the outside of the table, a border width, and make sure each column is 8em wide.

```ts
static styles = css`
:host {
  /* =================== */
  /* SIMPLE TABLE STYLES */
  /* =================== */

  --table-simple-background-color: var(--color-lt-violet);
  --table-simple-border-style: var(--border-solid);
  --table-simple-border-width: var(--border-1px);

  --table-simple-b1-width: 8em;
  --table-simple-b0-width: 8em;
}`;
```

You can see a complete version of this in the [test/table-test-simple.ts](https://github.com/adaburrows/table-web-component/blob/main/test/table-test-simple.ts) component.

## More advanced features

### HTML in headers

Lets update the simple example to actually show exponents in the heading. Let's replace the field definitions we created above with some new ones:

```ts
const fieldDefs: FieldDefinitions<TwoBits> = {
  'b1': new FieldDefinition<TwoBits>({heading: html`2<sup>1</sup>`}),
  'b0': new FieldDefinition<TwoBits>({heading: html`2<sup>0</sup>`})
}
```

This pulls in Lit HTML to allow rendering HTML in the headings. Technically, this could be as complicated as possible.

### Adding a caption to the table

Adding a caption is pretty simple, we just change the config passed to the `TableStore`. The value passed in, can be any value supported by the templating engine. In this case, we're using lit-html. In the headless mode, another renderer, like JSX/TSX in React, could be used and this would accept a fragment in that case.

```ts
    // Set up an example table
    this.tableStore = new TableStore({
      tableId: 'simple',
      fieldDefs,
      records: [
        { 'b1': 0, 'b0': 0 },
        { 'b1': 0, 'b0': 1 },
        { 'b1': 1, 'b0': 0 },
        { 'b1': 1, 'b0': 1 },
      ],
      caption: "2-bit truth table",
      // Show the header, some usages may not require headings
      showHeader: true
    });
```

### Sorting by certain fields

The field definitions can specify a sort function. There are currently two built in functions: `lexicographic` and `numeric`. [Lexicographic](https://en.wikipedia.org/wiki/Alphabetical_order) sorting is roughly alphanumerical, or "ASCIIbetical". The default function doesn't actually order by colating unicode codepoints first, it does it by byte order ([Read a tad bit more at MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)).

```ts
import { FieldDefinitions, FieldDefinition, numeric, lexicographic } from '@adaburrows/table/field-definitions';

/**
 * Demo of two sortable fields and two not sortable fields.
 */
const fieldDefs: FieldDefinitions<Example> = {
  'id': new FieldDefinition<Example>({
    heading: 'ID'
  }),
  'name': new FieldDefinition<Example>({
    heading: 'Name',
    sort: lexicographic
  }),
  'description': new FieldDefinition<Example>({
    heading: 'Desc.'
  }),
  'age': new FieldDefinition<Example>({
    heading: 'Age',
    sort: numeric
  })
};
```

#### Writing your own sorting functions

Since the sorting function is the built-in array sorting function, [the documents for that apply here as well](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#description).

### Decorating fields

Fields can be wrapped in HTML and/or other components in order to build very complex tables. Need to wrap a field in an image, or show a link to edit a particular object from the id? Easy:

```ts
const fieldDefs: FieldDefinitions<Example> = {
  'id': new FieldDefinition<Example>({
    heading: 'ID',
    decorator: (id: any) => html`<a href="/agent/edit/${id}/">Edit ${id}</a>`
  }),
  'img': new FieldDefinition<Example>({
    heading: 'Picture',
    decorator: (img: any) => html`<img src="${img}"></img>`
  }),
  'name': new FieldDefinition<Example>({
    heading: 'Name',
    sort: lexicographic
  }),
  'notes': new FieldDefinition<Example>({
    heading: 'Notes'
  })
};
```

### Synthesizing fields from a row

If your records are a little too complicated to just plop into a table, there's a slot for a function to transform the data in each record. This means a deeply nested or structured value can be transformed into a string, or several fields in an a record can be merged together. Perhaps there's a list of numbers in a record which need math to be done on them, like an average or other statistical function. This is the way to do that.

This is computed before the decoration is done, which means the result of this can be passed into a decorator function as well. The two functions used together can form a map-reduce of sorts. This leads to pretty amazing capabilities in a table.

```ts
const fieldDefs: FieldDefinitions<Example> = {
  // ...
  // Synthesize an average of the last ten measurements
  'avg': new FieldDefinition<Example>({
    heading: 'Rolling average',
    synthesizer: (data: Example) => (data.last_ten_measurements.reduce((acc, i) => acc + i) / data.length);
  })
  // ...
}
```

### Defining a footer

This component also lets one define a footer template which get the full set of records post field synthesis so one can compute sums, etc. of the various colums to summarize the table including the synthesized fields. Unfortunately, this is probably the least polished part of the table, but suggestions are welcome. However, here's an example of one passed into the `TableTest` example:

```ts
  constructor() {
    super();
    // Set up an example table
    this.tableStore = new TableStore({
      tableId: 'full-example',
      // ...
      // Set up a table footer that sums the values of the age row and the synthetic age row
      footerFunction: (data: Example[]) => {
        const sum1 = data.map((datum) => datum.age).reduce((acc, value) => acc + value, 0);
        //@ts-ignore
        const sum2 = data.map((datum) => datum['synth']).reduce((acc, value) => acc + value, 0);
        return html`<th colspan="3">Totals</th><td class="age">${sum1}</td><td class="synth">${sum2}</td><td></td>`;
      },
      // ...
    });
  }
```

### Defining column groups

```ts
  constructor() {
    super();
    // Set up an example table
    this.tableStore = new TableStore({
      tableId: 'full-example',
      // ...
      // These are used for coloring the column groups
      colGroups: [
        {span: 1, class: 'id-group'},
        {span: 2, class: 'descriptive-group'},
        {span: 2, class: 'numeric-group'},
        {span: 1, class: 'synthetic-group'}
      ],
      // ...
    });
  }
```

### Full list of FieldDefinition parameters

Please see [the source code](https://github.com/adaburrows/table-web-component/blob/main/src/field-definitions.ts) for full type information.

```ts
export interface FieldDefinitionProps<T> {
  // What it says on the tin, this is displayed in the header for the column
  heading: TemplateValue;

  // This takes a whole object, a whole record of untransformed data and creates a new field from it.
  synthesizer?: SynthesizerFunc<T>;

  // A decorator function, this takes a field (which could be any data type) and returns an HTML fragment
  decorator?: DecoratorFunc;

  // Sort function as per https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
  sort?: SortFunc;
}
```

### Full list of Table parameters

```ts
export interface TableStoreProps<T extends {}> {
  // The table ID used for CSS variables and HTML id
  tableId: string

  // The field definitions
  fieldDefs?: FieldDefinitions<T>

  // The records
  records?: T[]

  // The table caption
  // under the hood, this can be anything, so it can work with any library
  caption?: TemplateValue

  // The set of column groups as decribed above
  colGroups?: ColGroup[]

  // Initial sorting field
  sortField?: string

  // Initial direction of the sort used if an initial sort field is set
  sortDirection?: SortDirection // One of 'asc','desc','na'

  // Show the header, or hide the header
  showHeader?: boolean

  // Function passed the whole set of records that returns the footer HTML
  footerFunction?: RowFunc<T>
}
```

## Customizing CSS Variables

The system of variables has been designed for simplicity and reasonable defaults. While it does allow keeping things simple, it does have a lot of flexibility in configuration. One can make configuring the table as complicated as the want. Or, one can just keep it simple.

The whole table can have a border around it, or not. The whole table can be given a background color. Each column can be styled independently. Each column group can be given a background color. Odd and even rows can be given different background colors, and specific columns of odd and even rows can be given particular background colors.

To see the gory details of how all of this is put together, see the [table-style-directive.ts](https://github.com/adaburrows/table-web-component/blob/main/src/table-style-directive.ts). Or, to ease into it all, follow along. There's probably too much to take in at once anyways.

### Basic Styling

CSS variables can be put in various scopes. The easiest way of specifiying everything is to put it in an included CSS file. In that case, every variable is placed in the `:root {}` block. In the case of specifiying it in a component's shadown DOM, then they can be placed in a `:host {}` block.

The basic variables that can be specified for a table, along with their defaults, are these:

```css
:host {
  --table-${tableId}-background-color: transparent ;
  --table-${tableId}-width: 100% ;
  --table-${tableId}-max-width: 100% ;
  --table-${tableId}-height: auto ;
  --table-${tableId}-max-height: auto ;
  --table-${tableId}-margin: 0 ;
  --table-${tableId}-display: table ;
  --table-${tableId}-overflow-x: scroll ;
  --table-${tableId}-overflow-y: scroll ;
  --table-${tableId}-border-width: 2px ;
  --table-${tableId}-border-color: fuschia ;
  --table-${tableId}-border-style: solid ;
  --table-${tableId}-border-collapse: separate ;
  --table-${tableId}-border-spacing: 0px ;
}
```

Different parts of the table can be styled differently, for instance, the caption has variables that have the following default values.

```css
:host {
  --table-${tableId}-caption-background-color: transparent ;
  --table-${tableId}-caption-side: bottom ;
  --table-${tableId}-caption-align: left ;
  --table-${tableId}-caption-margin: 0 ;
  --table-${tableId}-caption-padding: 0 ;
  --table-${tableId}-caption-border-width: 0 ;
  --table-${tableId}-caption-border-color: transparent ;
  --table-${tableId}-caption-border-style: none ;
}
```
This variable controls the padding in each of the cells in the table.

```css
:host {
  --table-${tableId}-element-padding: 0.33em;
}
```

These variables can be used to create a sticky header, but their defaults create a normal table heading.

```css
:host {
  --table-${tableId}-header-position: static;
  --table-${tableId}-header-top: 0px;
}
```

### Per column variables

The sizes of each column can be specified through variables specified on a per field basis:

```css
:host {
  --table-${tableId}-${field}-min-width: auto;
  --table-${tableId}-${field}-max-width: auto;
  --table-${tableId}-${field}-width: auto;
}
```

Heading styles:

```css
:host {
  --table-${tableId}-${field}-heading-border-style: ;
  --table-${tableId}-${field}-heading-background-color: ;
  --table-${tableId}-${field}-heading-text-align: ;
  --table-${tableId}-${field}-heading-vertical-align: ;
}
```

Body cell styles:

```css
:host {
  --table-${tableId}-${field}-cell-border-style: ;
  --table-${tableId}-${field}-cell-background-color: ;
  --table-${tableId}-${field}-cell-text-align: ;
  --table-${tableId}-${field}-cell-vertical-align: ;
}
```

### Odd-even row coloring:

The coloring of odd/even rows is determined primarily by the first four variables listed below. If those are not defined then the next three variables will be used in order. If they are not present, the last three variables will be used. If those aren't present, it will default to transparent.

```css
:host {
  --table-${tableId}-${field}-row-even-background-color: white;
  --table-${tableId}-row-even-background-color: white;
  --table-${tableId}-${field}-row-odd-background-color: lt-grey;
  --table-${tableId}-row-odd-background-color: lt-grey;
  --table-${tableId}-${field}-cell-background-color: white;
  --table-${tableId}-body-cell-background-color: white;
  --table-${tableId}-background-color: transparent;
}
```

### Column groups

Every column group can have a particular background color assigned to them.

```css
:host {
  --table-${tableId}-${colGroup}-color: transparent;
}
```

### Customizing each section

The table can be divided into the header, body, and footer sections. The three sections of the table have a few variables that can be set:

```css
:host {
  --table-${tableId}-${section}-min-height: auto;
  --table-${tableId}-${section}-max-height: auto;
  --table-${tableId}-${section}-height: auto;
}
```

### Customizing borders

Note: By default all the borders that aren't specified have border widths of 0px.

The next set of variables need a table to help explain. Each part of the table can further be subdivded into multiple regions that each can be styled a certain way. This is mostly so that borders can be correctly styled to match. If you collapse the borders, then much of this configuration becomes unnecessary.

| header-first-heading | header-heading | header-last-heading |
|-|-|-|
| body-first-heading | body-heading | body-last-heading |
| body-first-cell | body-cell | body-last-cell |
| footer-first-heading | footer-heading | footer-last-heading |
| footer-first-cell | footer-cell | footer-last-cell |

Each of these regions have the following variables:

```css
:host {
  --table-${tableId}-${region}-background-color: transparent;
  --table-${tableId}-${region}-border-width: 1px 1px 1px 1px;
  --table-${tableId}-${region}-border-color: black;
  --table-${tableId}-${region}-border-style: solid dotted dashed none;
  --table-${tableId}-${region}-border-radius: 0px;
}
```

Since each of these variable can specify values for each side of the cell it corresponds to, this means there's a few options for ensuring the borders all tile properly.

Oh, I just realized that because there's no body-first-row-first-cell, body-first-row-last-cell, body-last-row-first-cell, body-last-row-last-cell CSS rules, there's no way to make a table with rounded corners without having both a header and a footer. Whoops.

### Order of precedence

Background colors (least to most specific)
```
--table-${tableId}-background-color
--table-${tableId}-heading-background-color
--table-${tableId}-header-first-heading-background-color
--table-${tableId}-header-heading-background-color
--table-${tableId}-header-last-heading-background-color
--table-${tableId}-body-first-cell-background-color
--table-${tableId}-body-cell-background-color
--table-${tableId}-body-last-cell-background-color
--table-${tableId}-${field}-background-color
--table-${tableId}-${field}-heading-background-color
--table-${tableId}-${field}-cell-background-color
--table-${tableId}-row-even-background-color
--table-${tableId}-row-odd-background-color
--table-${tableId}-${field}-row-even-background-color
--table-${tableId}-${field}-row-odd-background-color
```

Caption background colors (least to most specific)

```
transparent
--table-${tableId}-background-color
--table-${tableId}-caption-background-color
```

Header background colors (least to most specific)

```
transparent
--table-${tableId}-background-color
--table-${tableId}-heading-background-color
--table-${tableId}-${field}-background-color
--table-${tableId}-${field}-heading-background-color
```

Text align (least to most specific)

```
--table-text-align
--table-${tableId}-${field}-text-align
--table-${tableId}-${field}-heading-text-align
--table-${tableId}-${field}-cell-text-align
```

Vertical align (least to most specific)

```
--table-vertical-align
--table-${tableId}-${field}-vertical-align
--table-${tableId}-${field}-heading-vertical-align
--table-${tableId}-${field}-cell-vertical-align
```

## Headless usage

If you need a more custom HTML structure, or more custom styling, one can just use the `TableStore` directly to create their own component in just about any framework. The usage is pretty straighforward. The code in the `Table` component serves as a guide on how to use it. When using custom HTML, you can easily swap out a `<table>` structure for a flexbox or grid layout structure. Just do the following in your code and be sure to style the generated HTML properly:

```ts
import { FieldDefinitions, FieldDefinition } from '@adaburrows/table/field-definitions';
import { TableStore } from '@adaburrows/table/table-store';

// Insert the rest of the component here.

// ...

  static render(): TemplateResult {
    return html`
    <div id="${this.tableStore.tableId}">
      ${this.tableStore.caption && this.tableStore.caption != '' && html`<div class="table-caption">${this.tableStore.caption}</div>`}
      <div class="table-header">
        ${map(this.tableStore.getHeadings(), (rowValue) => {
          const {field, value} = rowValue;
          return html`
          <div class="table-header table-column-${field}">
            ${value}
          </div>`
        })}
      </div>
      <div class="table-body">
        ${map(this.tableStore.getRows(), (row) => html`
          <div class="table-row">
            ${map(row, (rowValue: RowValue) => {
              const {field, value} = rowValue;
              return html`<div class="table-cell table-column-${field}">${value}</div>`
            })}
          </div>`
        )}
      </div>
    </div>`;
  }


// ...
```

Additionally, if you want to use React as your framework. Then it would be pretty simple to use [`react-store-adaptors`](https://github.com/adaburrows/react-store-adaptors) to adapt the Svelte store to your JSX/TSX component. Otherwise, just import the React wrapped components from `@adaburrows/table-web-component/react`.
