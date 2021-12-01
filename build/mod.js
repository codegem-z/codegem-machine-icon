import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import _ from 'lodash';
import { importDir } from './utils';
const template = fs.readFileSync(path.join(__dirname, './template/taro.handlebars'), 'utf-8');
export default function machine(source, output) {
    if (source.length === 0) {
        return [];
    }
    const data = source[0];
    const result = [];
    data.filesInfo.map((file) => {
        const isValidPicture = /png|jpeg|jpg/.test(path.extname(file.ext)) && !/@[23]x/.test(file.name);
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
