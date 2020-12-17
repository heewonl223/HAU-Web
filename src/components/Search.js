import React, { Component} from "react";
import { dbService } from "fbase";
import AsyncSelect from 'react-select/async';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state={
            selectedTag: []
        }
    }
    
    loadOptions = async (inputValue) => {
        inputValue = inputValue.toLowerCase().replace(/\W/g, "");
        return new Promise((resolve => {
                dbService.collection('records_list')
                    .orderBy("hash")
                    .startAt(inputValue)
                    .endAt(inputValue + "\uf8ff")
                    .get()
                    .then(docs => {
                        if (!docs.empty) {
                            let recommendedTags = []
                            docs.forEach(function (doc) {
                                const tag = {
                                    value: doc.id,
                                    text: doc.data().text,
                                    label: doc.data().hash
                                }
                                recommendedTags.push(tag)
                            });
                            return resolve(recommendedTags)
                        } else {
                            return resolve([])
                        }
                    })
    
        }))
    };

    handleOnChange = (tags) => {
        this.setState({
            selectedTag: [tags]
        })
    }
    render() {
    return (
        <div>
            <div id = "search_temp">
            :)
            </div>

            <div id = "search_input" >
            <AsyncSelect
                loadOptions={this.loadOptions}
                onChange={this.handleOnChange}
            />
        
            </div>
            <div id ="select_tag">
                Selected Tag:
            </div>
            {
                this.state.selectedTag.map(e => {
                    return (
                        <>
                        <li key={e.value}>
                            {e.text}
                            {e.label}
                        </li>
                        
                        </>
                    )
                })
            }
        </div>
    );
    }
    
};
export default Search;