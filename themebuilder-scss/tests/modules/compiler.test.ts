import path from 'path';
import fs from 'fs';

import { metadata } from '../data/metadata';
import noModificationsMeta from '../data/compilation-results/no-changes-meta';

import Compiler, { ImportType } from '../../src/modules/compiler';

jest.mock('../../src/data/metadata/dx-theme-builder-metadata', () => ({
  __esModule: true,
  metadata,
}));

const dataPath: string = path.join(path.resolve(), 'tests', 'data');
const indexFileName = path.join(dataPath, 'scss', 'widgets', 'generic', '_index.scss');
const defaultIndexFileContent = fs.readFileSync(indexFileName, 'utf8');
const includePaths = [path.join(dataPath, 'scss', 'widgets', 'generic'), path.join(dataPath, 'scss', 'bundles')];
const file = path.join(dataPath, 'scss', 'bundles', 'dx.light.scss');

describe('compile', () => {
  test('Compile with empty modifications (check that items can be undefined)', async () => {
    const compiler = new Compiler();
    compiler.indexFileContent = defaultIndexFileContent;
    return compiler.compile(file, null, {
      loadPaths: [...includePaths],
    }).then((data) => {
      // compiled css
      expect(data.result.css.toString()).toBe(`.dx-accordion {
  background-color: "Helvetica Neue", "Segoe UI", helvetica, verdana, sans-serif;
  color: #337ab7;
  background-image: url(icons/icons.woff2);
}
.dx-accordion .from-base {
  background-color: transparent;
  color: #337ab7;
}`);
      // collected variables
      expect(data.changedVariables).toEqual(noModificationsMeta);
    });
  });

  test('Compile with one base and one accordion items modified', async () => {
    const compiler = new Compiler();
    compiler.indexFileContent = defaultIndexFileContent;
    return compiler.compile(file, [
      { key: '$base-accent', value: 'red' },
      { key: '$accordion-item-title-opened-bg', value: 'green' },
    ], {
      loadPaths: [...includePaths],
    }).then((data) => {
      // compiled css
      expect(data.result.css.toString()).toBe(`.dx-accordion {
  background-color: "Helvetica Neue", "Segoe UI", helvetica, verdana, sans-serif;
  color: red;
  background-image: url(icons/icons.woff2);
}
.dx-accordion .from-base {
  background-color: green;
  color: red;
}`);
      // collected variables
      expect(data.changedVariables).toEqual({
        '$base-font-family': '"Helvetica Neue", "Segoe UI", helvetica, verdana, sans-serif',
        '$base-accent': '#ff0000',
        '$accordion-title-color': '#ff0000',
        '$accordion-item-title-opened-bg': '#008000',
      });
    });
  });

  test('Compile with error', async () => {
    const compiler = new Compiler();
    compiler.indexFileContent = defaultIndexFileContent;
    return compiler.compile('dx.error.scss', [], { }).then(
      () => expect(false).toBe(true),
      (error) => {
        expect(error.code).toBe('ERR_INVALID_URL');
        expect(`${error.message}: ${error.input}`).toBe('Invalid URL: dx.error.scss');
      },
    );
  });

  test('Compile with custom sass compiler options (try to compile with custom data)', async () => {
    const compiler = new Compiler();
    compiler.indexFileContent = defaultIndexFileContent;
    const bundleContent = fs.readFileSync(file, 'utf8');
    return compiler.compileString(
      `${bundleContent}.extra-class { color: red; }`,
      [],
      {
        loadPaths: [...includePaths],
        style: 'compressed' as const,
      },
    ).then((data) => {
      // compiled css
      expect(data.result.css.toString()).toBe(
        '.dx-accordion{background-color:'
        + '"Helvetica Neue","Segoe UI",helvetica,verdana,sans-serif;'
        + 'color:#337ab7;background-image:url(icons/icons.woff2)}.dx-accordion '
        + '.from-base{background-color:transparent;color:#337ab7}.extra-class{color:red}',
      );
    });
  });
});

describe('compile with widgets', () => {
  test('getImportType', () => {
    expect(Compiler.getImportType('tb_generic')).toBe(ImportType.Color);
    expect(Compiler.getImportType('../widgets/generic/tb_index')).toBe(ImportType.Index);
    expect(Compiler.getImportType('colors')).toBe(ImportType.Unknown);
  });

  test('setter return indexFileContent for index file', () => {
    const compiler = new Compiler();
    const contentOfIndexFile = 'some content';
    const indexFileUrl = new URL('db:../widgets/generic/tb_index');
    compiler.indexFileContent = contentOfIndexFile;

    expect(compiler.load(indexFileUrl)).toEqual({
      contents: contentOfIndexFile,
      syntax: 'scss',
    });
  });
});
