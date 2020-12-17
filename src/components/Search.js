import React, {useState} from "react";
import { dbService } from "fbase";

const Search =({userObj})=>{
    const [keyword,setKeyword]=useState('');
    const [recommendedTags,setRecommendedTags]=useState([]);

    const searching= async (event)=>{
        event.preventDefault();
        let Key=keyword;
        
        setRecommendedTags([]);
        await dbService
            .collection('records_list')
            .orderBy("hash")
            .startAt(Key)
            .endAt(Key + "\uf8ff")
            .get()
            .then(docs => {
                if(!docs.empty){
                    docs.forEach((doc)=>{
                        const tag={
                            value: doc.id,
                            text:doc.data().text,
                            label:doc.data().hash,
                            creatorId: doc.data().creatorId
                        }
                        setRecommendedTags((recommendedTags)=>recommendedTags.concat(tag));
                    })
                }
                
            })
        setKeyword('');    
    }


    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setKeyword(value);
    };

    return(
        <div id="search_all">
            <div>
                <form onSubmit={searching}>
                        <input id="search_input" value={keyword} onChange={onChange} type="text" placeholder="Enter Keyword"/>
                        <input id="search_btn" type="submit" value="Search"/>                 
                </form>
            </div>

            --------------------------------------------------
            <div>
                My Daily Log
                <br/>
                {recommendedTags.map((tag)=>(
                    tag.creatorId===userObj.uid && 
                        (<div className="record_container"> 
                            📃 {tag.text}
                            <br/>
                            ⭐ {tag.label}
                            <br/>
                        </div>)
                    
                ))}
            </div>
            --------------------------------------------------
            <div>
                Other's Daily Log
                <br/>
                {recommendedTags.map((tag)=>(
                    tag.creatorId!==userObj.uid && 
                        (<div className="record_container">
                            📃 {tag.text}
                            <br/>
                            ⭐ {tag.label}
                            <br/>
                        </div>)
                    
                ))}
            </div>
        </div>
    );
};
export default Search;