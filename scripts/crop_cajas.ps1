Add-Type -AssemblyName System.Drawing

$outDir = "assets/Cajas_trimmed"
if (-not (Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir | Out-Null
}

$files = Get-ChildItem "assets/Cajas/*.png"
foreach ($f in $files) {
    $bmp = [System.Drawing.Bitmap]::FromFile($f.FullName)
    $minX = $bmp.Width
    $minY = $bmp.Height
    $maxX = 0
    $maxY = 0

    for ($x = 0; $x -lt $bmp.Width; $x++) {
        for ($y = 0; $y -lt $bmp.Height; $y++) {
            $p = $bmp.GetPixel($x, $y)
            if ($p.A -gt 15) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }

    $w = [Math]::Max(1, $maxX - $minX + 1)
    $h = [Math]::Max(1, $maxY - $minY + 1)
    $rect = New-Object System.Drawing.Rectangle($minX, $minY, $w, $h)
    $cropped = $bmp.Clone($rect, $bmp.PixelFormat)
    $dest = Join-Path $outDir $f.Name
    $cropped.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $cropped.Dispose()
    Write-Host "Cropped $($f.Name): width=$w, height=$h"
}
