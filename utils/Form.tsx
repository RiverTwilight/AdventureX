import React, { useState } from 'react'
import { isBoolean } from 'util';

type eleCon = {
    header: string,
    placeholder: string,
    id: string,
    block: boolean,
    type?: 'input' | 'switch'
}

const Form = ({ config, onValueChange, defaultValue = {} }: {
    config: eleCon[],
    onValueChange: (newForm: any) => void,
    defaultValue?: {
        [key: string]: any
    }
}) => {
    const initialData = {}
    for (let i of config) {
        let { id, type } = i
        initialData[id] = type ? { switch: true }[type] : ""
    }
    const formContent = defaultValue || initialData;
    return (
        <fieldset className="form-group">
            {config.map(({ header, type, placeholder, block, id }, index) => {
                console.log(formContent[id])
                switch (type) {
                    case 'switch': return (
                        <React.Fragment key={id}>
                            <label className="paper-switch">
                                <input id="paperSwitch4" name="paperSwitch4" type="checkbox" />
                                <span className="paper-switch-slider"></span>
                            </label>
                            {header && <label data-for="paperSwitch4" className="paper-switch-label">
                                {header}
                            </label>}
                        </React.Fragment>

                    )
                    default: return (
                        <React.Fragment key={id}>
                            {header && <label data-for={index} >{header}</label>}
                            <input onChange={e => {
                                formContent[id] = e.target.value
                                onValueChange(formContent)
                            }} value={formContent[id]} className={`${block && "input-block"}`} type="text" placeholder={placeholder} id={String(index)} />
                        </React.Fragment>
                    )
                }
            })}
        </fieldset>
    )
}

export default Form
