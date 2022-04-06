import { useEffect, useState } from "react";
import style from "./App.module.css";




function App() {
  const [lone, setlon] = useState();
  const [lati, setlat] = useState();
  
  const new_script = src => { 
    return new Promise((resolve, reject) => { 
      const script = document.createElement('script'); 
      script.src = src; 
      script.addEventListener('load', () => { 
        resolve(); 
      }); 
      script.addEventListener('error', e => { 
        reject(e); 
      }); 
      document.head.appendChild(script); 
    }); 
  };

  useEffect(() => { 
    navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
    //카카오맵 스크립트 읽어오기
    const my_script = new_script('https://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=8894cb8f3eedf8df828b4dac6c91c873');
    
    //스크립트 읽기 완료 후 카카오맵 설정
    my_script.then(() => { 
      console.log(lati,lone);  
      const kakao = window['kakao']; 
      kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        const options = { 
          center: new kakao.maps.LatLng(lati, lone), //좌표설정
          level: 3 
          
        }; 
        const map = new kakao.maps.Map(mapContainer, options); //맵생성
        //마커설정
        const markerPosition = new kakao.maps.LatLng(lati,lone); 
        const marker = new kakao.maps.Marker({ 
          position: markerPosition
        }); 
        marker.setMap(map); 
      });   

      
    });
  }, [{lati, lone}]);


  const onGeoOk = (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    
    setlon(lon);
    setlat(lat);
  }

  const onGeoError = () => {
    
  }
 

//   var infowindow = new kakao.maps.InfoWindow({zIndex:1});

// var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
//     mapOption = {
//         center: new kakao.maps.LatLng(37.566826, 126.9786567), // 지도의 중심좌표
//         level: 3 // 지도의 확대 레벨
//     };  

// // 지도를 생성합니다    
// var map = new kakao.maps.Map(mapContainer, mapOption); 

// // 장소 검색 객체를 생성합니다
// var ps = new kakao.maps.services.Places(); 

// // 키워드로 장소를 검색합니다
// ps.keywordSearch('이태원 맛집', placesSearchCB); 

// // 키워드 검색 완료 시 호출되는 콜백함수 입니다
// function placesSearchCB (data, status, pagination) {
//     if (status === kakao.maps.services.Status.OK) {

//         // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
//         // LatLngBounds 객체에 좌표를 추가합니다
//         var bounds = new kakao.maps.LatLngBounds();

//         for (var i=0; i<data.length; i++) {
//             displayMarker(data[i]);    
//             bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
//         }       

//         // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
//         map.setBounds(bounds);
//     } 
// }

// // 지도에 마커를 표시하는 함수입니다
// function displayMarker(place) {
    
//     // 마커를 생성하고 지도에 표시합니다
//     var marker = new kakao.maps.Marker({
//         map: map,
//         position: new kakao.maps.LatLng(place.y, place.x) 
//     });

//     // 마커에 클릭이벤트를 등록합니다
//     kakao.maps.event.addListener(marker, 'click', function() {
//         // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
//         infowindow.setContent('<div style="padding:5px;font-size:12px;">' + place.place_name + '</div>');
//         infowindow.open(map, marker);
//     });
// }
    
  

  
  
  return (
    <div>
      <div id = "map"className={style.map} ></div>
    </div>
  );

}

export default App;
