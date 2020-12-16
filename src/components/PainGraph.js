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
    const [partNames,setPartNames]=useState([""]);
    const [degreeData,setDegreeData]=useState([0]);
    const [nameList,setNameList]=useState([""]);

    const [painpart,setPainpart]=useState("My PainGraph");

    // 그래프 데이터 업데이트 함수
    const fetchData=(selectName)=>{
        setPartNames([]);
        setDegreeData([]);
        
        let labelName=[], degreeDatum=[], partName=[];
        //dbService 객체 == firestore객체
        dbService
        .collection("records_list") //record_list 컬렉션 반환
        .orderBy("createdAt")
        .get()      //상위 컬렉션의 모든 다큐먼트를 갖는 promise 반환
        .then((docs)=>{
            //forEach함수로 각각의 다큐먼트에대해 함수 실행(map이랑 동일한듯..?)
            setPainpart("My PainGraph");
            docs.forEach((doc)=>{
                if(doc.data().creatorId===userObj.uid){
                    labelName.push(doc.data().part);
                    partName.push(doc.data().createdAt.substring(2,12)+'\n\n\n\n\n'+doc.data().part);
                    degreeDatum.push(doc.data().degree);
                }
            });
            setNameList(Array.from(new Set(labelName)));

            if (selectName!==""){
                setPainpart(selectName);
                degreeDatum=[]; partName=[];
                docs.forEach((doc)=>{
                    if(doc.data().creatorId===userObj.uid){
                        if(doc.data().part===selectName){
                        
                        partName.push(doc.data().createdAt.substring(2,12));
                        degreeDatum.push(doc.data().degree);
                    }
                    }
                });
            }
            //받아온 데이터 barData state에 추가
            setPartNames((partNames)=>partNames.concat(partName));
            setDegreeData((degreeData)=>degreeData.concat(degreeDatum));  
        })
    }
  
 

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
        <div style={{width:500}}>
            <div>{painpart}</div>
            <Bar
                data={graphdata}
                options={graphoptions}
                height={300}
                width={500}
            />
            <button //데이터와 그래프 동기화 버튼
                onClick={()=>{fetchData('')}}>Update</button>
            {nameList.map((name)=> (
                //병명에 따른 그래프 나타내는 버튼
                <button onClick={()=>fetchData(name)}>{name}</button>
            ))}           
            
        </div>
    );
}

export default PainGraph
