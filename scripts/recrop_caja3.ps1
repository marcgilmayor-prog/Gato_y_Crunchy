Add-Type -AssemblyName System.Drawing

$f = "assets/Cajas/Cajas-3.png"
$bmp = [System.Drawing.Bitmap]::FromFile((Resolve-Path $f).Path)

# The cat box is in the upper-left quadrant (x: 0..600, y: 0..400)
$minX = $bmp.Width
$minY = $bmp.Height
$maxX = 0
$maxY = 0

for ($x = 0; $x -lt 650; $x++) {
    for ($y = 0; $y -lt 450; $y++) {
        $p = $bmp.GetPixel($x, $y)
        if ($p.A -gt 30) {
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
$dest = "assets/Cajas_trimmed/Cajas-3.png"
$cropped.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$cropped.Dispose()
Write-Host "Re-cropped Cajas-3.png: width=$w, height=$h"
