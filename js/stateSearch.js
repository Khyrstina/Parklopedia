const stateSelect = document.getElementById('stateId');
const textBox = document.getElementById('textBox');

stateSelect.addEventListener('change', (event) => {
const selectedState = stateSelect.value;
textBox.value = selectedState;
});