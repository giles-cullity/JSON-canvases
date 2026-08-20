$inputFile = "constraint stage template planning reasoning navigation graph (under construction).canvas"
$outputFile = "constraint-template-reasoning.json"

$colorMap = @{
    "1" = "#ff3f2f"
    "2" = "#ff5f1f"
    "3" = "#ffca28"
    "4" = "#1fff7f"
    "5" = "#5fffff"
    "6" = "#7f5fff"
}

function Get-DisplayNameFromPath($path) {
    if ([string]::IsNullOrWhiteSpace($path)) {
        return ""
    }

    return [System.IO.Path]::GetFileNameWithoutExtension($path)
}

$json = Get-Content $inputFile -Raw | ConvertFrom-Json

if ($json.nodes) {
    $newNodes = @()

    foreach ($node in $json.nodes) {
        if ($node.color -and $colorMap.ContainsKey([string]$node.color)) {
            $node.color = $colorMap[[string]$node.color]
        }

        if ($node.type -eq "file" -and $node.file) {
            $displayName = Get-DisplayNameFromPath $node.file

            $newNode = [ordered]@{
                id       = $node.id
                type     = "text"
                x        = $node.x
                y        = $node.y
                width    = $node.width
                height   = $node.height
                text     = $displayName
                notePath = $node.file
            }

            if ($node.PSObject.Properties.Name -contains "color" -and $node.color) {
                $newNode.color = $node.color
            }

            $newNodes += [pscustomobject]$newNode
        }
        else {
            $newNodes += $node
        }
    }

    $json.nodes = $newNodes
}

if ($json.edges) {
    foreach ($edge in $json.edges) {
        if ($edge.color -and $colorMap.ContainsKey([string]$edge.color)) {
            $edge.color = $colorMap[[string]$edge.color]
        }
    }
}

$json | ConvertTo-Json -Depth 100 | Set-Content $outputFile -Encoding UTF8