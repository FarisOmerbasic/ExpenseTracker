$ErrorActionPreference = 'Stop'
Set-Location 'c:\Users\Korisnik\Desktop\projects\ExpenseTracker'

$extensions = @('*.cs','*.ts','*.tsx','*.js','*.jsx','*.css','*.scss','*.cshtml')
$skipPattern = '\\(bin|obj|node_modules|dist|coverage|\.git|docker\\build)\\'

$files = Get-ChildItem -Recurse -File -Include $extensions | Where-Object { $_.FullName -notmatch $skipPattern }
$changed = 0

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $updated = $content

    $updated = [regex]::Replace($updated, '\{\s*/\*[\s\S]*?\*/\s*\}', '', 'Singleline')
    $updated = [regex]::Replace($updated, '/\*[\s\S]*?\*/', '', 'Singleline')
    $updated = [regex]::Replace($updated, '(?m)^[ \t]*///.*\r?\n?', '')
    $updated = [regex]::Replace($updated, '(?m)^[ \t]*//.*\r?\n?', '')

    if ($updated -ne $content) {
        [System.IO.File]::WriteAllText($file.FullName, $updated, [System.Text.UTF8Encoding]::new($false))
        $changed++
    }
}

Write-Host "Processed $($files.Count) files; modified $changed files."
