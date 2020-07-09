// fetch("https://zillow-com.p.rapidapi.com/properties-nearby?lot=false&asc=false&multi_family=false&radius=5&apartment=false&for_sale=false&townhouse=false&recently_sold=false&for_rent=false&page=1&max_price=0&manufactured=false&min_price=0&sort=change&foreclosed=false&single_family=false&condo=false&pre_foreclosure=false&longitude=-122.40057774847898&latitude=37.788719679657554", {
// 	"method": "GET",
// 	"headers": {
// 		"x-rapidapi-host": "zillow-com.p.rapidapi.com",
// 		"x-rapidapi-key": "14ac62fbb2mshd58e729e7b4f36ep1704c5jsn9ba276807be6"
// 	}
// })
// .then(response => {
// 	console.log(response);
// })
// .catch(err => {
// 	console.log(err);
// });

fetch("https://realtor.p.rapidapi.com/properties/v2/list-for-rent?sort=relevance&radius=10&city=Katy&state_code=TX&limit=200&offset=0", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "realtor.p.rapidapi.com",
		"x-rapidapi-key": "14ac62fbb2mshd58e729e7b4f36ep1704c5jsn9ba276807be6"
	}
})
.then(response => {
	response.json().then(function(data){
		var rentListArr = []
	})
	//console.log(response);
})
.catch(err => {
	console.log(err);
});