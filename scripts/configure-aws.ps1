<#
Interactive AWS CLI helper
1) If AWS CLI is not installed, downloads and runs the MSI installer.
2) Prompts locally for Access Key ID and Secret Access Key (secret kept local).
3) Sets region (default us-east-1) and output format (default json).
4) Runs `aws sts get-caller-identity` to verify configuration.

Usage (from project root):
    powershell -ExecutionPolicy Bypass -File .\scripts\configure-aws.ps1

Important: Do NOT paste secrets into chat. If keys were exposed, revoke them immediately in the AWS Console.
#>

function Ensure-AwsCliInstalled {
    try {
        aws --version | Out-Null
        return $true
    }
    catch {
        Write-Host "AWS CLI not found. Downloading installer..."
        $msi = Join-Path $env:TEMP "AWSCLIV2.msi"
        try {
            Invoke-WebRequest "https://awscli.amazonaws.com/AWSCLIV2.msi" -OutFile $msi -UseBasicParsing -ErrorAction Stop
        }
        catch {
            Write-Error "Failed to download AWS CLI installer: $_"
            return $false
        }

        Write-Host "Launching installer (UAC prompt may appear)."
        try {
            Start-Process msiexec.exe -ArgumentList "/i `"$msi`" /qn" -Verb RunAs -Wait -ErrorAction Stop
        }
        catch {
            Write-Warning "Silent install failed or was cancelled. Running interactive installer instead."
            Start-Process msiexec.exe -ArgumentList "/i `"$msi`"" -Wait
        }

        try {
            aws --version | Out-Null
            Write-Host "AWS CLI installed successfully."
            return $true
        }
        catch {
            Write-Error "AWS CLI installation did not succeed or is not on PATH."
            return $false
        }
    }
}

try {
    $installed = Ensure-AwsCliInstalled
    if (-not $installed) {
        Write-Error "Cannot proceed without AWS CLI. Please install manually and re-run this script."
        exit 1
    }

    $accessKey = Read-Host "AWS Access Key ID"
    $secretSecure = Read-Host "AWS Secret Access Key" -AsSecureString
    $region = Read-Host "Default region name (e.g. us-east-1)" -Default "us-east-1"
    $output = Read-Host "Default output format (json/text/table)" -Default "json"

    $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secretSecure)
    $secret = [Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)

    Write-Host "Configuring AWS CLI profile 'default'..."
    aws configure set aws_access_key_id $accessKey
    aws configure set aws_secret_access_key $secret
    aws configure set region $region
    aws configure set output $output

    Remove-Variable secret -ErrorAction SilentlyContinue

    Write-Host "Running test: aws sts get-caller-identity"
    $result = aws sts get-caller-identity 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Success:"
        Write-Host $result
        exit 0
    }
    else {
        Write-Error "Test failed:"
        Write-Error $result
        exit $LASTEXITCODE
    }

}
catch {
    Write-Error "An unexpected error occurred: $_"
    exit 1
}

