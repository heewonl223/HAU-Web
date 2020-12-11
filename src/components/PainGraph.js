import {dbService} from "fbase";
import React, {useEffect, useState } from "react";
import {Bar} from "react-chartjs-2";


//////////////////////////그래프 모양 설정//////////////////////////////
const graphoptions={
    legend:{
        display:false   // label 보이기 여부
    },
    scales:{
        yAxes:[{
            ticks:{
                min:0, // y축 스케일에 대한 최소값 설정
                stepSize:1, // y축 그리드 한 칸당 수치
            }
        }]
    },

    animation:{
        animateScale:true
    },
    responsive:false,

    //false : 그래프 사용자 정의 크기
    //true : 그래프 크기 자동 결정
    maintainAspectRatio:false
}
//////////////////////////////////////////////////////////////////


const PainGraph=({userObj})=>{
    const [dataDate,setDataDate]=useState([0]);
    const [partNames,setPartNames]=useState([""]);
    const [degreeData,setDegreeData]=useState([0]);
    const [nameList,setNameList]=useState([""]);

    const [painpart,setPainpart]=useState("");

    // 그래프 데이터 업데이트 함수
    const fetchData=(selectName)=>{
        setPartNames([]);
        setDegreeData([]);
        setDataDate([]);
        
        let datumDate=[], degreeDatum=[], partName=[];
        //dbService 객체 == firestore객체
        dbService
        .collection("records_list") //record_list 컬렉션 반환
        .orderBy("createdAt")
        .get()      //상위 컬렉션의 모든 다큐먼트를 갖는 promise 반환
        .then((docs)=>{
            //forEach함수로 각각의 다큐먼트에대해 함수 실행(map이랑 동일한듯..?)
            setPainpart("");
            docs.forEach((doc)=>{
                if(doc.data().creatorId===userObj.uid){
                    datumDate.push(doc.data().createdAt);
                    partName.push(doc.data().part);
                    degreeDatum.push(doc.data().degree);
                }
            });
            setNameList(Array.from(new Set(partName)));

            if (selectName!==""){
                setPainpart(selectName);
                datumDate=[]; degreeDatum=[]; partName=[];
                docs.forEach((doc)=>{
                    if(doc.data().creatorId===userObj.uid){
                        if(doc.data().part===selectName){
                        
                        partName.push(doc.data().createdAt);
                        degreeDatum.push(doc.data().degree);
                    }
                    }
                });
            }
            //받아온 데이터 barData state에 추가
            setDataDate((dataDate)=>dataDate.concat(datumDate));
            setPartNames((partNames)=>partNames.concat(partName));
            setDegreeData((degreeData)=>degreeData.concat(degreeDatum));  
        })
    }
  
    
   
/* ----------------------------------------------------------
    안 쓸 것같은데 혹시 몰라서 뒀습니다.. 최종 업데이트 할 때 지울게요
    useEffect(() => {
        // snapshot : any change in database -> alert
        dbService.collection("records_list")
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
            const nameArray = snapshot.docs.map((doc) => ({
                // every item on array will look like this
                id: doc.data().creator,
                name : doc.data().part
                
            }));
                        
            setNameList(new Set(nameArray));
        });
    }, []);
---------------------------------------------------------------*/


    // 최초 렌더링 시 fetchData 한 번 실행
    useEffect(()=>{
        fetchData('');
    }, []);

    const graphdata={
        //각 막대별 라벨
        labels:partNames,
        datasets:[
            {
                borderWidth:1,  //테두리 두께
                data: degreeData, // 수치,,?
                backgroundColor:'skyblue'
    
            }
        ]
    };

    return (
        <div style={{width:300}}>
            <div>{painpart}</div>
            <Bar
                data={graphdata}
                options={graphoptions}
                height={300}
            />
            <button //이건....만약 자동동기화가 안되면 수동 동기화를 해야하기 때문에....일단..... 
                onClick={()=>{fetchData('')}}>Update</button>
            {nameList.map((name)=> (
                <button onClick={()=>fetchData(name)}>{name}</button>
            ))}           
            
        </div>
    );
}

export default PainGraph