window.addEventListener('load', () => {
    // Wait a short moment, then fade out loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
    }, 1000);
});

document.getElementById('calculateBtn').addEventListener('click', function() {
    var motherFeet = parseFloat(document.getElementById('motherFeet').value);
    var motherInches = parseFloat(document.getElementById('motherInches').value);
    var fatherFeet = parseFloat(document.getElementById('fatherFeet').value);
    var fatherInches = parseFloat(document.getElementById('fatherInches').value);
    var gender = document.querySelector('input[name="gender"]:checked').value;

    const resultElement = document.getElementById('result');

    // Validate inputs
    if (
        isNaN(motherFeet) || isNaN(motherInches) || 
        isNaN(fatherFeet) || isNaN(fatherInches)
    ) {
        resultElement.innerHTML = '<i class="fas fa-exclamation-circle" style="color:#e53935;"></i> Please enter valid heights.';
        return;
    }

    // Convert to inches
    var motherTotalInches = (motherFeet * 12) + motherInches;
    var fatherTotalInches = (fatherFeet * 12) + fatherInches;

    if (motherTotalInches <= 0 || fatherTotalInches <= 0) {
        resultElement.innerHTML = '<i class="fas fa-exclamation-circle" style="color:#e53935;"></i> Heights must be greater than zero.';
        return;
    }

    // Calculation
    // Boy: ((mom + dad) / 2) + 2.5 inches
    // Girl: ((mom + dad) / 2) - 2.5 inches
    var estimatedInches;
    if (gender === "boy") {
        estimatedInches = ((motherTotalInches + fatherTotalInches) / 2) + 2.5;
    } else {
        estimatedInches = ((motherTotalInches + fatherTotalInches) / 2) - 2.5;
    }

    // Convert back to ft/in
    var estFeet = Math.floor(estimatedInches / 12);
    var estInches = Math.round(estimatedInches % 12);

    // Show result with an icon
    resultElement.innerHTML = '<i class="fas fa-child" style="color:#4CAF50;"></i> Estimated Adult Height: ' 
                              + estFeet + ' ft ' + estInches + ' in';
});
