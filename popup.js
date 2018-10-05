(function(){
	let storage = window.storage || chrome.storage;
	let stateImage = document.getElementById("addonStateImage");

	if(stateImage==null)
	{
		console.error("Something went wrong!");
		return;
	}
	function toggle()
	{
			let prom = storage.local.set({isDisabled:!currentState});
			if(window.Promise && prom instanceof Promise) {
				prom.reject(()=>{});
			}
			update();
	}
	stateImage.addEventListener("click",toggle)
	let stateDesc = document.getElementById("addonStateDescriptor");
	if(stateDesc==null)
	{
		console.error("Something went wrong!");
		return;
	}
	window.update = function() {
		storage.local.get(['isDisabled'], function(result){
			if(result===undefined) {
				result={isDisabled:false};
			}
			window.currentState = result.isDisabled==true;
			stateImage.style.backgroundImage = "url('powerbutton_"+(result.isDisabled?"off":"on")+".png')";
			stateDesc.innerHTML = result.isDisabled?"disabled":"enabled";
			stateDesc.style.color = result.isDisabled?"#7C1D1D":"#217A3D";
		});
	}
	update();
})();