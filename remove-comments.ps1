param(
  [string]$Root = "c:\Users\Korisnik\Desktop\projects\ExpenseTracker"
)

$cStyleExt = @(".cs", ".ts", ".tsx", ".js", ".jsx", ".css", ".scss", ".sql")
$xmlExt = @(".csproj", ".props", ".targets", ".xml", ".xaml")
$hashLineExt = @(".yml", ".yaml")

function Is-ExcludedPath([string]$path) {
  return (
    $path -like "*\.git\*" -or
    $path -like "*\bin\*" -or
    $path -like "*\obj\*" -or
    $path -like "*\node_modules\*" -or
    $path -like "*\dist\*" -or
    $path -like "*\build\*" -or
    $path -like "*\coverage\*"
  )
}

function Remove-CStyleComments([string]$text) {
  $sb = New-Object System.Text.StringBuilder
  $len = $text.Length
  $i = 0
  $inString = $false
  $stringChar = [char]0
  $inLineComment = $false
  $inBlockComment = $false
  $escape = $false

  while ($i -lt $len) {
    $c = $text[$i]
    $n = if ($i + 1 -lt $len) { $text[$i + 1] } else { [char]0 }

    if ($inLineComment) {
      if ($c -eq "`r") {
        [void]$sb.Append($c)
      }
      elseif ($c -eq "`n") {
        [void]$sb.Append($c)
        $inLineComment = $false
      }
      $i++
      continue
    }

    if ($inBlockComment) {
      if ($c -eq '*' -and $n -eq '/') {
        $inBlockComment = $false
        $i += 2
      }
      else {
        if ($c -eq "`r" -or $c -eq "`n") {
          [void]$sb.Append($c)
        }
        $i++
      }
      continue
    }

    if ($inString) {
      [void]$sb.Append($c)
      if ($escape) {
        $escape = $false
      }
      elseif ($c -eq '\\') {
        $escape = $true
      }
      elseif ($c -eq $stringChar) {
        $inString = $false
        $stringChar = [char]0
      }
      $i++
      continue
    }

    if ($c -eq '/' -and $n -eq '/') {
      $inLineComment = $true
      $i += 2
      continue
    }

    if ($c -eq '/' -and $n -eq '*') {
      $inBlockComment = $true
      $i += 2
      continue
    }

    if ($c -eq '"' -or $c -eq "'" -or $c -eq [char]96) {
      $inString = $true
      $stringChar = $c
      [void]$sb.Append($c)
      $i++
      continue
    }

    [void]$sb.Append($c)
    $i++
  }

  return $sb.ToString()
}

function Remove-HashLineComments([string]$text) {
  $lines = [regex]::Split($text, "`r?`n")
  $out = New-Object System.Collections.Generic.List[string]
  foreach ($line in $lines) {
    if ($line -match '^\s*#') {
      continue
    }
    $out.Add($line)
  }
  return [string]::Join("`n", $out)
}

function Remove-XmlComments([string]$text) {
  return [regex]::Replace($text, '<!--[\s\S]*?-->', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)
}

$files = Get-ChildItem -Path $Root -Recurse -File | Where-Object {
  -not (Is-ExcludedPath $_.FullName) -and
  $_.FullName -ne (Join-Path $Root "remove-comments.ps1")
}

$updated = 0
foreach ($f in $files) {
  $ext = $f.Extension.ToLowerInvariant()
  if (($cStyleExt -notcontains $ext) -and ($xmlExt -notcontains $ext) -and ($hashLineExt -notcontains $ext)) {
    continue
  }

  $original = Get-Content -LiteralPath $f.FullName -Raw
  $processed = $original

  if ($cStyleExt -contains $ext) {
    $processed = Remove-CStyleComments $processed
  }

  if ($xmlExt -contains $ext) {
    $processed = Remove-XmlComments $processed
  }

  if ($hashLineExt -contains $ext) {
    $processed = Remove-HashLineComments $processed
  }

  if ($processed -ne $original) {
    Set-Content -LiteralPath $f.FullName -Value $processed -NoNewline
    $updated++
  }
}

Write-Host "Done. Updated files: $updated"
