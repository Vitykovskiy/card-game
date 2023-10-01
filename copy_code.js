const fs = require("fs");
const path = require("path");
const ignore = require("ignore");

function mergeFiles(directory = "./") {
  const gitIgnoreFilePath = path.join(directory, ".gitignore");

  let gitIgnoreContent = "";
  if (fs.existsSync(gitIgnoreFilePath)) {
    // Читаем содержимое .gitignore
    gitIgnoreContent = fs.readFileSync(gitIgnoreFilePath, "utf-8");
  }

  // Создаем экземпляр объекта ignore для игнорирования файлов из .gitignore
  const gitIgnore = ignore().add(gitIgnoreContent);

  // Получаем список файлов и папок в текущей директории
  const files = fs.readdirSync(directory);

  let mergedCode = "";

  // Обрабатываем каждый файл
  files.forEach((file) => {
    // Получаем полный путь к файлу
    const filePath = path.resolve(directory, file);

    // Игнорируем файлы и папки, указанные в .gitignore
    if (gitIgnore.ignores(path.relative(directory, filePath))) {
      return;
    }

    // Проверяем, является ли файл папкой
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      // Рекурсивно вызываем функцию для обработки файлов во вложенной папке
      mergedCode += mergeFiles(filePath);
      return;
    }

    // Получаем расширение файла
    const ext = path.extname(filePath).toLowerCase();

    // Пропускаем файлы, которые не являются текстовыми html или ts файлами
    if (ext !== ".html" && ext !== ".ts") {
      return;
    }

    // Читаем содержимое файла
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Добавляем перед содержимым файла его название с расширением
    mergedCode += `/* ${file} */\n\n${fileContent}\n\n`;
  });

  return mergedCode;
}

// Вызываем функцию с текущей директорией
const mergedCode = mergeFiles();

// Записываем объединенный код в файл output.txt
fs.writeFileSync("output.txt", mergedCode, "utf-8");

console.log("Files merged successfully!");
