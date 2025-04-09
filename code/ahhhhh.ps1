<#
.SYNOPSIS
  Tests each URL in models\meshManifest.js to ensure it returns a valid .glb file.

.DESCRIPTION
  Reads each line from the manifest, extracts the URL using a regex,
  issues a HEAD request to the combined base URL and the extracted path,
  and prints the HTTP status and Content-Type.
  
  Look for "Status: 200" and a Content-Type that indicates a GLB file
  (usually "model/gltf-binary" or similar).

.EXAMPLE
  PS C:\Users\SANTA\Documents\JSgames\JSgames\code> .\test-model-urls.ps1
#>

param(
  [string]$BaseUrl      = "http://localhost:5174",
  [string]$ManifestPath = "models\meshManifest.js"
)

if (-Not (Test-Path $ManifestPath)) {
  Write-Error "Manifest not found at path: $ManifestPath"
  exit 1
}

# Updated regex pattern to capture the URL path (including the trailing double quote)
$pattern = 'url":\s*"(?<u>/models/[^"]+)"'

# Read the manifest and process each matching line
Get-Content $ManifestPath | ForEach-Object {
    if ($_ -match $pattern) {
        $url = $matches['u']
        Write-Host "Testing $url …" -NoNewline
        try {
            $resp = Invoke-WebRequest -Uri ($BaseUrl + $url) -Method Head -UseBasicParsing
            $status = $resp.StatusCode
            $ctype = $resp.Headers['Content-Type']
            Write-Host " Status: $status, Content-Type: $ctype"
        }
        catch {
            Write-Host " FAILED: $($_.Exception.Message)"
        }
    }
}
