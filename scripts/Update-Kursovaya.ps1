#Requires -Version 5.1
param(
  [string] $DocPath = (Join-Path (Split-Path $PSScriptRoot -Parent) "Kursovaya_rabota_po_pm_08_mdk_01_predfinalny_variant.docx"),
  [string] $RepoRoot = (Split-Path $PSScriptRoot -Parent),
  [switch] $SkipScreenshots
)

$ErrorActionPreference = "Stop"

$assetsPath = Join-Path $PSScriptRoot "kursovaya-assets.json"
if (-not (Test-Path -LiteralPath $assetsPath)) { throw "Missing kursovaya-assets.json next to this script." }
$assets = Get-Content -LiteralPath $assetsPath -Encoding UTF8 | ConvertFrom-Json
$tocRows = @($assets.toc)
$m = $assets.markers

$wdAlignTabRight = 2
$wdTabLeaderDots = 1
$wdPageNumber = 7
$wdAlertsNone = 0
$wdCollapseStart = 1
$wdCollapseEnd = 0
$wdPageBreak = 7
$wdFindStop = 0

function Get-HeadingPageInRange {
  param([object] $SearchRange, [string] $FindText)
  $range = $SearchRange.Duplicate
  $find = $range.Find
  $find.ClearFormatting()
  $find.Replacement.ClearFormatting()
  $find.Text = $FindText
  $find.Forward = $true
  $find.Wrap = $wdFindStop
  $find.Format = $false
  $find.MatchCase = $false
  $find.MatchWholeWord = $false
  $find.MatchWildcards = $false
  $find.MatchSoundsLike = $false
  $find.MatchAllWordForms = $false
  $found = $find.Execute()
  if (-not $found) { return $null }
  [int] $range.Information($wdPageNumber)
}

function Set-TocParagraphFormat {
  param([object] $Paragraph, [double] $TabPosPt = 470)
  $pf = $Paragraph.Format
  $pf.TabStops.ClearAll()
  [void] $pf.TabStops.Add($TabPosPt, $wdAlignTabRight, $wdTabLeaderDots)
}

function Add-MonospaceBlock {
  param([object] $Document, [string] $Caption, [string] $Code)
  $r = $Document.Content
  $r.Collapse($wdCollapseEnd)
  $r.InsertAfter("$Caption`r")
  $r = $Document.Content
  $r.Collapse($wdCollapseEnd)
  $startCode = $r.Start
  $r.InsertAfter($Code + "`r`r")
  $codeRng = $Document.Range($startCode)
  [void] $codeRng.MoveEnd(1, $Code.Length)
  $codeRng.Font.Name = "Consolas"
  $codeRng.Font.Size = 9
}

function Truncate-Code {
  param([string] $Text, [int] $Max = 3500)
  if ($Text.Length -le $Max) { return $Text }
  $Text.Substring(0, $Max) + "`r`r... (fragment truncated)"
}

if (-not (Test-Path -LiteralPath $DocPath)) {
  throw "Document not found: $DocPath"
}

$shotsDir = Join-Path $RepoRoot "kursovaya-materials"
New-Item -ItemType Directory -Force -Path $shotsDir | Out-Null

$chrome = @(
  "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe",
  "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $SkipScreenshots -and $chrome) {
  Push-Location $RepoRoot
  try {
    if (-not (Test-Path "node_modules")) { npm install }
    $dev = Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "npm run dev -- --port 3000" -WorkingDirectory $RepoRoot -PassThru -WindowStyle Hidden
    Start-Sleep -Seconds 14
    foreach ($u in @(
        @{ Url = "http://127.0.0.1:3000/"; Out = "lapadom-home.png" }
        @{ Url = "http://127.0.0.1:3000/rooms"; Out = "lapadom-rooms.png" }
        @{ Url = "http://127.0.0.1:3000/cabinet"; Out = "lapadom-cabinet.png" }
        @{ Url = "http://127.0.0.1:3000/book/dog-suite-1"; Out = "lapadom-book.png" }
      )) {
      $outPath = Join-Path $shotsDir $u.Out
      & $chrome --headless=new --window-size=1400,900 --hide-scrollbars --screenshot="$outPath" $u.Url 2>$null
    }
  }
  finally {
    if ($dev -and -not $dev.HasExited) {
      Stop-Process -Id $dev.Id -Force -ErrorAction SilentlyContinue
    }
    Get-CimInstance Win32_Process -Filter "Name='node.exe'" -ErrorAction SilentlyContinue |
      Where-Object { $_.CommandLine -match "next dev" } |
      ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
    Pop-Location
  }
}

$word = $null
$doc = $null
try {
  $word = New-Object -ComObject Word.Application
  $word.Visible = $false
  $word.DisplayAlerts = $wdAlertsNone
  $doc = $word.Documents.Open($DocPath)

  $rngStart = $doc.Content
  [void] $rngStart.Find.Execute($m.tocTitle)
  $tocInsertPos = $rngStart.Paragraphs(1).Range.End

  $rngSeek = $doc.Range($tocInsertPos, $doc.Content.End)
  $rngSeek.Find.ClearFormatting()
  $rngSeek.Find.Text = $m.tocEndBefore
  $tocEndPos = $null
  if ($rngSeek.Find.Execute()) {
    $tocEndPos = $rngSeek.Paragraphs(1).Range.Start
  }
  if ($null -eq $tocEndPos) {
    $rngSeek = $doc.Range($tocInsertPos, $doc.Content.End)
    $rngSeek.Find.ClearFormatting()
    $rngSeek.Find.Text = $m.introHeading
    if (-not $rngSeek.Find.Execute()) { throw "TOC end marker not found." }
    $tocEndPos = $rngSeek.Paragraphs(1).Range.Start
  }

  $doc.Range($tocInsertPos, $tocEndPos).Delete()

  $rngTocAnchor = $doc.Content
  [void] $rngTocAnchor.Find.Execute($m.tocTitle)
  $tocInsertPos = $rngTocAnchor.Paragraphs(1).Range.End

  $tail = $doc.Content
  $tail.Collapse($wdCollapseEnd)
  [void] $tail.InsertBreak($wdPageBreak)
  $tail = $doc.Content
  $tail.Collapse($wdCollapseEnd)
  $tail.InsertAfter($m.appendixHeading + "`r")
  $h = $doc.Paragraphs.Last.Range
  $h.Font.Bold = $true
  $h.Font.Size = 14
  $h.ParagraphFormat.SpaceAfter = 12

  $tail = $doc.Content
  $tail.Collapse($wdCollapseEnd)
  $tail.InsertAfter($assets.appendixIntro + "`r`r")

  foreach ($listing in $assets.listings) {
    $path = Join-Path $RepoRoot ($listing.file -replace "/", "\")
    $raw = Get-Content -LiteralPath $path -Raw -Encoding UTF8
    Add-MonospaceBlock -Document $doc -Caption $listing.caption -Code (Truncate-Code $raw)
  }

  $tail = $doc.Content
  $tail.Collapse($wdCollapseEnd)
  $tail.InsertAfter($assets.screenshotsIntro + "`r`r")

  foreach ($pair in $assets.screenshots) {
    $fp = Join-Path $shotsDir $pair.file
    $tail = $doc.Content
    $tail.Collapse($wdCollapseEnd)
    if (Test-Path -LiteralPath $fp) {
      $null = $doc.InlineShapes.AddPicture($fp, $false, $true, $tail)
      $tail = $doc.Content
      $tail.Collapse($wdCollapseEnd)
      $tail.InsertAfter("`r$($pair.cap)`r`r")
    }
    else {
      $tail.InsertAfter("[Screenshot placeholder: $($pair.cap)]`r`r")
    }
  }

  $ins = $doc.Range($tocInsertPos, $tocInsertPos)
  $ins.Collapse($wdCollapseStart)
  $num = 1
  foreach ($row in $tocRows) {
    $ins.InsertAfter("$num. $($row.label)`t?`r")
    $ins.Collapse($wdCollapseEnd)
    $para = $doc.Range($tocInsertPos, $ins.End).Paragraphs.Last
    Set-TocParagraphFormat -Paragraph $para
    $num++
  }
  $ins.InsertAfter("$num. $($assets.appendixTocLabel)`t?`r")
  $ins.Collapse($wdCollapseEnd)
  $paraLast = $doc.Range($tocInsertPos, $ins.End).Paragraphs.Last
  Set-TocParagraphFormat -Paragraph $paraLast

  $rngV = $doc.Content
  [void] $rngV.Find.Execute($m.introHeading)
  $bodyFrom = $rngV.Start
  $rngA = $doc.Content
  [void] $rngA.Find.Execute($m.appendixHeading)
  $appendixHeadingStart = $rngA.Start
  $bodyRange = $doc.Range($bodyFrom, $appendixHeadingStart)

  $rngTocTitle = $doc.Content
  [void] $rngTocTitle.Find.Execute($m.tocTitle)
  $titleEnd = $rngTocTitle.Paragraphs(1).Range.End
  $tocFirstParaNum = 0
  $k = 0
  foreach ($pp in $doc.Paragraphs) {
    $k++
    if ($pp.Range.Start -lt $titleEnd) { continue }
    if ($pp.Range.Text -match "^\s*1\.\s") {
      $tocFirstParaNum = $k
      break
    }
  }
  if ($tocFirstParaNum -eq 0) { throw "Could not resolve TOC paragraph index." }

  $pagesMain = foreach ($row in $tocRows) {
    $p = Get-HeadingPageInRange -SearchRange $bodyRange -FindText $row.find
    if ($null -eq $p) { $p = "?" }
    $p
  }
  $rngAppSearch = $doc.Range($appendixHeadingStart, $doc.Content.End)
  $appPage = Get-HeadingPageInRange -SearchRange $rngAppSearch -FindText $m.appendixHeading
  if ($null -eq $appPage) { $appPage = "?" }

  for ($i = 0; $i -lt $tocRows.Count; $i++) {
    $tocPara = $doc.Paragraphs($tocFirstParaNum + $i)
    $pg = $pagesMain[$i]
    $lbl = [string]$tocRows[$i].label
    $tocPara.Range.Text = "$($i + 1). $lbl`t$pg`r"
    Set-TocParagraphFormat -Paragraph $tocPara
  }
  $tocAppPara = $doc.Paragraphs($tocFirstParaNum + $tocRows.Count)
  $tocAppPara.Range.Text = "$num. $($assets.appendixTocLabel)`t$appPage`r"
  Set-TocParagraphFormat -Paragraph $tocAppPara

  $doc.Save()
}
finally {
  if ($doc) { $doc.Close() | Out-Null }
  if ($word) { $word.Quit() | Out-Null }
  if ($word) { [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) }
}

$pptPath = Join-Path (Split-Path $DocPath -Parent) "Prezentatsiya_LapaDom.pptx"
$pptOutputPath = $pptPath
$ppt = $null
$pres = $null
try {
  $ppt = New-Object -ComObject PowerPoint.Application
  $ppt.Visible = 1
  $pres = $ppt.Presentations.Add()
  while ($pres.Slides.Count -gt 0) { $pres.Slides(1).Delete() }

  $layout = $pres.SlideMaster.CustomLayouts.Item(2)

  foreach ($sl in $assets.slides) {
    $nextIdx = [Math]::Max(1, $pres.Slides.Count + 1)
    $null = $pres.Slides.AddSlide($nextIdx, $layout)
    $s = $pres.Slides($pres.Slides.Count)
    $s.Shapes.Title.TextFrame.TextRange.Text = $sl.title
    if ($s.Shapes.Count -ge 2) {
      $s.Shapes.Item(2).TextFrame.TextRange.Text = [string]$sl.body
    }
  }

  # Add screenshots to key slides (if files exist).
  $slideImages = @(
    @{ Index = 2; File = "lapadom-home.png"; Left = 340; Top = 105; Width = 560; Height = 315 },
    @{ Index = 6; File = "lapadom-rooms.png"; Left = 340; Top = 105; Width = 560; Height = 315 },
    @{ Index = 7; File = "lapadom-cabinet.png"; Left = 340; Top = 105; Width = 560; Height = 315 },
    @{ Index = 8; File = "lapadom-book.png"; Left = 340; Top = 105; Width = 560; Height = 315 }
  )

  foreach ($item in $slideImages) {
    if ($item.Index -gt $pres.Slides.Count) { continue }
    $imgPath = Join-Path $shotsDir $item.File
    if (-not (Test-Path -LiteralPath $imgPath)) { continue }
    $slide = $pres.Slides($item.Index)
    # Keep title and text on the left, screenshot on right with consistent grid.
    $null = $slide.Shapes.AddPicture(
      $imgPath,
      $false,
      $true,
      [single]$item.Left,
      [single]$item.Top,
      [single]$item.Width,
      [single]$item.Height
    )
  }

  $pptSavePath = $pptPath
  if (Test-Path -LiteralPath $pptPath) {
    try {
      Remove-Item -LiteralPath $pptPath -Force
    }
    catch {
      $stamp = Get-Date -Format "yyyyMMdd_HHmmss"
      $pptSavePath = Join-Path (Split-Path $pptPath -Parent) ("Prezentatsiya_LapaDom_" + $stamp + ".pptx")
    }
  }
  $pres.SaveAs($pptSavePath)
  $pptOutputPath = $pptSavePath
}
finally {
  if ($pres) { $pres.Close() }
  if ($ppt) { $ppt.Quit(); [void][System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) }
}

Write-Host "Done:"
Write-Host "  Doc: $DocPath"
Write-Host "  PPT: $pptOutputPath"
Write-Host "  PNG: $shotsDir"
