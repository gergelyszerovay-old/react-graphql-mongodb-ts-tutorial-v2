import * as fs from 'fs';

export const GenerateClientSideInputs = (sourceDir: string, destDir: string) => {
    const dir: fs.Dirent[] = fs.readdirSync(sourceDir, {withFileTypes: true});

    dir.map((dirent: fs.Dirent) => {
        console.log(dirent.name)
        const data = fs.readFileSync(sourceDir + '/' + dirent.name, 'UTF-8');

        const lines = data.split(/\r?\n/);
        const linesFiltered = lines.map(l => {
            if (l.includes('// @SERVER')) {
                return '// ' + l;
            } else {
                return l;
            }
        });
        fs.writeFileSync(destDir + '/' + dirent.name, "// Auto-generated file, do not modify\n\n" + linesFiltered.join("\n"), 'UTF-8');
    });
}