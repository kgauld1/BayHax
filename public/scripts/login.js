var idBox = document.getElementById('id-box');

idBox.addEventListener('keyup', async e => {
	if (e.keyCode == '13'){
		let val = idBox.value;
		idBox.value = "";
		let response = await fetch('/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({id: val})
		});
		let json = await response.json();

		if ('success' in json){
			window.location.href = json.success;
		}
		else{
			document.getElementById('message').innerHTML = "*id does not exist"
		}

	}
});