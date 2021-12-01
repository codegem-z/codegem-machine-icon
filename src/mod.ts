import { FileInfoType } from './type.js';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import _ from 'lodash';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { importDir } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const template = fs.readFileSync(
  path.join(__dirname, './template/taro.handlebars'),
  'utf-8',
);

function machine(
  source: any[],
  output: string,
): { pathname: string; code: string }[] | [] {
  if (source.length === 0) {
    return [];
  }

  const data = source[0] as { files: string[]; filesInfo: FileInfoType[] };
  const result: { pathname: string; code: string }[] = [];
  data.filesInfo.map((file) => {
    const isValidPicture =
      /png|jpeg|jpg/.test(path.extname(file.ext)) && !/@[23]x/.test(file.name);
    if (isValidPicture) {
      const { name: icon, base: iconFile, path: filePath } = file;
      const iconComponent = _.upperFirst(_.camelCase(icon));

      const targetPath = path.resolve(output, iconFile);
      const importPath = importDir(targetPath, filePath);

      const code = handlebars.compile(template)({
        icon,
        iconFile: importPath,
        iconComponent,
      });

      result.push({ pathname: targetPath, code });
    }
  });
  return result;
}

const generateIcon = (
  output: string,
): ((source: any[]) => { pathname: string; code: string }[]) => {
  return (source: any[]) => {
    return machine(source, output);
  };
};

export default generateIcon;
