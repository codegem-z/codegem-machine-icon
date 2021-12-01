import path from 'path';
export function importDir(target, current) {
    const targetArray = target.split(path.sep);
    targetArray.shift();
    const currentArray = current.split(path.sep);
    currentArray.shift();
    let num = 0;
    for (let i = 0; i < targetArray.length; i += 1) {
        if (targetArray[i] === currentArray[i]) {
            num += 1;
        }
        else {
            break;
        }
    }
    targetArray.splice(0, num);
    currentArray.splice(0, num);
    let importPath = '';
    for (let j = 0; j < currentArray.length - 1; j += 1) {
        importPath += '../';
    }
    if (!importPath) {
        importPath += './';
    }
    importPath += currentArray.join('/');
    return importPath;
}
