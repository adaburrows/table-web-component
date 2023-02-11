# Lit-based Table Web Component

![](./TableDemoGifMed.gif)


## Using the table component

First, make sure you install the package and its necessary dependencies. Since this project assumes you're using Lit, it expects that to be included by your project. It also expects lit-svelte-stores to be loaded. If you're not using any of those directly, make sure they are set as peer dependencies. Like so:

```
npm i --save @adaburrows/table lit lit-svelte-stores
```

or

```
npm i --save-peer lit lit-svelte-stores
npm i --save @adaburrows/table
```

If you're not making a component using the scoped registry mixin, then you can import everything you need in one line:

```ts
import { FieldDefinitions, FieldDefinition, TableStore } from '@adaburrows/table/table';
```

Otherwise, you can use the full set of imports:

```ts
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ScopedRegistryHost } from '@lit-labs/scoped-registry-mixin';
import { FieldDefinitions, FieldDefinition } from '@adaburrows/table/field-definitions';
import { TableStore } from '@adaburrows/table/table-store';
import { Table } from '@adaburrows/table/table';
```

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

Adding a caption is pretty simple, we just change the config passed to the `TableStore`:

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

This component also lets one define a footer template which get the full set of records so one can compute sums, etc. of the various colums to summarize the table. Unfortunately, this is probably the least polished part of the table, but suggestions are welcome. However, here's an example of one passed into the `TableTest` example:

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
  heading: string | TemplateResult;

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
  // The table caption as a string
  caption?: string
  // The set of column groups as decribed above
  colGroups?: ColGroup[]
  // Initial sorting field
  sortField?: string
  // Initial direction of the sort used if an initial sort field is set
  sortDirection?: SortDirection
  // Show the header, or hide the header
  showHeader?: boolean
  // Function passed the whole set of records that returns the footer HTML
  footerFunction?: FooterFunc<T>
}
```

## Customizing CSS Variables

The system of variables has been designed for simplicity and reasonable defaults. While it does allow keeping things simple, it does have a lot of flexibility in configuration. One can make configuring the table as complicated as the want. Or, one can just keep it simple.

The whole table can have a border around it, or not. The whole table can be given a background color. Each column can be styled independently. Each column group can be given a background color. Odd and even rows can be given different background colors, and specific columns of odd and even rows can be given particular background colors.

### First things first

CSS variables can be put in various scopes. The easiest way of specifiying everything is to put it in an included CSS file. In that case, every variable is placed in the `:root {}` block. In the case of specifiying it in a component's shadown DOM, then they can be placed in a `:host {}` block.

The basic variables that can be specified for a table are:

```css
:host {
}
```