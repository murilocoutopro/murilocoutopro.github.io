Add-Type -AssemblyName System.Drawing
$root = (Join-Path $PSScriptRoot '..\public\assets')
$source = [System.Drawing.Bitmap]::new("$root\presencial.png")
$clean = [System.Drawing.Bitmap]::new($source)
# Only the empty background surrounding the embedded logo is changed.
# The replacement texture comes from the same approved photograph, below it.
for ($y=55; $y -lt 185; $y++) {
 for ($x=710; $x -lt 1125; $x++) {
  $edge = [Math]::Min([Math]::Min($x-710,1124-$x),[Math]::Min($y-55,184-$y))
  $a = [Math]::Min(1.0,$edge/14.0)
  $old = $source.GetPixel($x,$y)
  $patch = $source.GetPixel($x,$y+140)
  $r=[int][Math]::Round($old.R*(1-$a)+$patch.R*$a)
  $g=[int][Math]::Round($old.G*(1-$a)+$patch.G*$a)
  $b=[int][Math]::Round($old.B*(1-$a)+$patch.B*$a)
  $clean.SetPixel($x,$y,[System.Drawing.Color]::FromArgb($r,$g,$b))
 }
}
$clean.Save("$root\presencial-sem-logo.png",[System.Drawing.Imaging.ImageFormat]::Png)
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$parameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
$parameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality,[long]92)
$clean.Save("$root\presencial-sem-logo.jpg",$encoder,$parameters)
# Extract the approved gold artwork pixel-for-pixel; remove its dark background.
$logo=[System.Drawing.Bitmap]::new(398,104,[System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for($y=0;$y -lt 104;$y++){
 for($x=0;$x -lt 398;$x++){
  $c=$source.GetPixel($x+720,$y+70)
  $strength=[Math]::Min(($c.R-115)/35.0,($c.G-$c.B-20)/25.0)
  if($x -gt 105 -and ($y -gt 76 -or $y -lt 13)){$strength=0}
  $alpha=[int][Math]::Round(255*[Math]::Max(0,[Math]::Min(1,$strength)))
  $logo.SetPixel($x,$y,[System.Drawing.Color]::FromArgb($alpha,$c.R,$c.G,$c.B))
 }
}
$logo.Save("$root\christ-embassy-caucaia-dourada.png",[System.Drawing.Imaging.ImageFormat]::Png)
$logo.Dispose();$clean.Dispose();$source.Dispose()
Write-Output 'Hero background cleaned; original faces preserved. Gold logo extracted.'
