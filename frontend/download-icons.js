const fs = require('fs');
const path = require('path');
const https = require('https');
const { getIconForFile, getIconForFolder } = require('vscode-icons-js');

// Base URL for VS Code Icons
const ICONS_BASE_URL = 'https://raw.githubusercontent.com/vscode-icons/vscode-icons/master/icons/';

// Directory to save icons
const ICONS_DIR = path.join(__dirname, 'src/assets/vscode-icons');

// Ensure icons directory exists
if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// Common file extensions and folder names to download icons for
const fileExtensions = [
    // Programming languages
    'js', 'ts', 'jsx', 'tsx', 'py', 'php', 'java', 'cpp', 'c', 'h', 'hpp',
    'cs', 'rb', 'go', 'rs', 'swift', 'kt', 'scala', 'hs', 'clj', 'erl', 'ex',
    'dart', 'lua', 'pl', 'r', 'm', 'jl', 'fs', 'vb', 'ps1', 'sh', 'bash', 'zsh',
    
    // Web technologies
    'html', 'htm', 'css', 'scss', 'sass', 'less', 'json', 'xml', 'yaml', 'yml',
    'toml', 'ini', 'env', 'svg', 'vue', 'svelte',
    
    // Documents
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'md', 'rtf',
    
    // Images
    'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp', 'ico', 'avif',
    
    // Audio/Video
    'mp3', 'wav', 'flac', 'aac', 'ogg', 'mp4', 'avi', 'mkv', 'mov', 'wmv',
    
    // Archives
    'zip', 'rar', '7z', 'tar', 'gz', 'bz2',
    
    // System files
    'exe', 'dll', 'so', 'app', 'dmg', 'deb', 'rpm', 'msi',
    
    // Config files
    'dockerfile', 'gitignore', 'gitattributes', 'editorconfig', 'eslintrc',
    'prettierrc', 'babelrc', 'webpack', 'rollup', 'vite', 'package', 'tsconfig',
    'nginx', 'conf', 'sql', 'log', 'lock'
];

const folderNames = [
    'src', 'lib', 'dist', 'build', 'public', 'assets', 'images', 'css', 'js',
    'components', 'pages', 'utils', 'helpers', 'services', 'api', 'config',
    'test', 'tests', '__tests__', 'spec', 'docs', 'documentation', 'examples',
    'node_modules', '.git', '.vscode', '.idea', 'vendor', 'bin',
    'azure', 'aws', 'docker', 'nuget', 'expo'
];

// Function to download a file
function downloadFile(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            } else {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
            }
        }).on('error', reject);
    });
}

// Download icons for file extensions
async function downloadFileIcons() {
    console.log('Downloading file icons...');
    const downloaded = new Set();
    
    for (const ext of fileExtensions) {
        try {
            const iconName = getIconForFile(`test.${ext}`);
            if (iconName && !downloaded.has(iconName)) {
                const url = `${ICONS_BASE_URL}${iconName}`;
                const filepath = path.join(ICONS_DIR, iconName);
                
                if (!fs.existsSync(filepath)) {
                    await downloadFile(url, filepath);
                    console.log(`Downloaded: ${iconName}`);
                    downloaded.add(iconName);
                    
                    // Small delay to avoid overwhelming the server
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
        } catch (error) {
            console.error(`Error downloading icon for .${ext}:`, error.message);
        }
    }
}

// Download icons for folders
async function downloadFolderIcons() {
    console.log('Downloading folder icons...');
    const downloaded = new Set();
    
    for (const folderName of folderNames) {
        try {
            const iconName = getIconForFolder(folderName);
            if (iconName && !downloaded.has(iconName)) {
                const url = `${ICONS_BASE_URL}${iconName}`;
                const filepath = path.join(ICONS_DIR, iconName);
                
                if (!fs.existsSync(filepath)) {
                    await downloadFile(url, filepath);
                    console.log(`Downloaded: ${iconName}`);
                    downloaded.add(iconName);
                    
                    // Small delay to avoid overwhelming the server
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
        } catch (error) {
            console.error(`Error downloading icon for folder ${folderName}:`, error.message);
        }
    }
    
    // Download default folder icons
    const defaultFolderIcons = ['folder.svg', 'folder_type_default.svg', 'folder_type_default_opened.svg'];
    for (const iconName of defaultFolderIcons) {
        try {
            const url = `${ICONS_BASE_URL}${iconName}`;
            const filepath = path.join(ICONS_DIR, iconName);
            
            if (!fs.existsSync(filepath)) {
                await downloadFile(url, filepath);
                console.log(`Downloaded: ${iconName}`);
            }
        } catch (error) {
            console.error(`Error downloading ${iconName}:`, error.message);
        }
    }
}

// Download default file icon
async function downloadDefaultIcons() {
    console.log('Downloading default icons...');
    const defaultIcons = ['file.svg', 'file_type_default.svg'];

    for (const iconName of defaultIcons) {
        try {
            const url = `${ICONS_BASE_URL}${iconName}`;
            const filepath = path.join(ICONS_DIR, iconName);

            if (!fs.existsSync(filepath)) {
                await downloadFile(url, filepath);
                console.log(`Downloaded: ${iconName}`);
            }
        } catch (error) {
            console.error(`Error downloading ${iconName}:`, error.message);
        }
    }
}

// Download specific missing icons
async function downloadSpecificIcons() {
    console.log('Downloading specific missing icons...');
    const specificIcons = [
        'file_type_npm.svg',
        'file_type_yarn.svg',
        'file_type_git.svg',
        'file_type_light_ini.svg'
    ];

    for (const iconName of specificIcons) {
        try {
            const url = `${ICONS_BASE_URL}${iconName}`;
            const filepath = path.join(ICONS_DIR, iconName);

            if (!fs.existsSync(filepath)) {
                await downloadFile(url, filepath);
                console.log(`Downloaded: ${iconName}`);
            }
        } catch (error) {
            console.error(`Error downloading ${iconName}:`, error.message);
        }
    }
}

// Main function
async function main() {
    try {
        await downloadDefaultIcons();
        await downloadFileIcons();
        await downloadFolderIcons();
        await downloadSpecificIcons();
        console.log('All icons downloaded successfully!');
    } catch (error) {
        console.error('Error downloading icons:', error);
    }
}

main();
