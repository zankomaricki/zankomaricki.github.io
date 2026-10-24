# Preprost lokalni strežnik za predogled strani: http://localhost:8080
$root = $PSScriptRoot
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add('http://localhost:8080/')
$l.Start()
Write-Host "Streznik tece na http://localhost:8080"
$types = @{ '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.jpg'='image/jpeg'; '.png'='image/png'; '.svg'='image/svg+xml'; '.mp4'='video/mp4' }
while ($l.IsListening) {
  $c = $l.GetContext()
  # napaka pri eni zahtevi (npr. brskalnik prekine prenos videa) ne sme ustaviti strežnika
  try {
    $p = [Uri]::UnescapeDataString($c.Request.Url.AbsolutePath.TrimStart('/'))
    if ($p -eq '') { $p = 'index.html' }
    $f = Join-Path $root $p
    if ((Test-Path $f -PathType Leaf) -and ([IO.Path]::GetFullPath($f).StartsWith($root))) {
      $b = [IO.File]::ReadAllBytes($f)
      $ct = $types[[IO.Path]::GetExtension($f).ToLower()]
      if ($ct) { $c.Response.ContentType = $ct }
      $c.Response.Headers.Add('Cache-Control', 'no-cache')
      $c.Response.ContentLength64 = $b.Length
      $c.Response.OutputStream.Write($b, 0, $b.Length)
    } else { $c.Response.StatusCode = 404 }
  } catch {
  } finally {
    try { $c.Response.Close() } catch {}
  }
}
