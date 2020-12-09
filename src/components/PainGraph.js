import {dbService} from "fbase";
import React, { useCallback, useEffect, useState } from "react";
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

    //const [barData,setBarData]=useState([]);
    const [dataDate,setDataDate]=useState([0]);
    const [partNames,setPartNames]=useState([""]);
    const [degreeData,setDegreeData]=useState([0]);

    const fetchData=()=>{
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
            docs.forEach((doc)=>{
                if(doc.data().creatorId===userObj.uid){
                    datumDate.push(doc.data().createdAt);
                    partName.push(doc.data().part);
                    degreeDatum.push(doc.data().degree);
                }
                
            });
            //받아온 데이터 barData state에 추가
            setDataDate((dataDate)=>dataDate.concat(datumDate));
            setPartNames((partNames)=>partNames.concat(partName));
            setDegreeData((degreeData)=>degreeData.concat(degreeDatum));
        })
    }

    
    /*최초 렌더링 이후에 실행하기 위해 useEffect 내부에서 함수 실행
    이부분이 데이터변화에 따라서 자동업데이트 되고 그런 부분인데
    일단 좀 더 공부가 필요할 듯 하여.... 이거 풀면 렉먹어요 뭔가
    무한 업데이트 되는 듯
    useEffect(()=>{
        fetchData();
    }, [fetchData]);
    */



    const graphdata={
        //각 막대별 라벨
        labels:partNames,
        datasets:[
            {
                borderWidth:1,  //테두리 두께
                data: degreeData, // 수치,,?
                backgroundColor:'blue'   //막대 색
    
            }
        ]
    };

    return (
        <div style={{width:1000}}>
            <Bar
                data={graphdata}
                options={graphoptions}
                height={300}
            />
            <button //이건....만약 자동동기화가 안되면 수동 동기화를 해야하기 때문에....일단..... 
                onClick={()=>{fetchData()}}>데이터가져오깅</button>
            <button //이건 테스트용 버튼이라 나중에 삭제할거예욤
                onClick={()=>{console.log(dataDate)}}>욥</button>
        </div>
    );
}


export default PainGraph