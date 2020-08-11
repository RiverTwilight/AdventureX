import React, { useState, useCallback } from 'react'

const Form = ({ config, onValueChange }: {
    config: {
        header: string,
        placeholder: string,
        id: string,
        block: boolean,
        type?: 'input' | 'switch'
    }[],
    onValueChange: (newForm: any) => void
}) => {
    const initialData = {};
    for (let i in config) {
        initialData[config[i].id] = config[i].type ? { switch: true }[config[i].type] : ""
    }
    const [formContent, setFormContent] = useState(initialData);
    return (
        <fieldset className="form-group">
            {config.map(({ header, type, placeholder, block, id }, index) => {
                switch (type) {
                    case 'switch': return (
                        <>
                            <label className="paper-switch">
                                <input id="paperSwitch4" name="paperSwitch4" type="checkbox" />
                                <span className="paper-switch-slider"></span>
                            </label>
                            {header && <label data-for="paperSwitch4" className="paper-switch-label">
                                {header}
                            </label>}
                        </>
                    )
                    default: return (
                        <>
                            {header && <label data-for={index} >{header}</label>}
                            <input onChange={e => {
                                formContent[id] = e.target.value
                                setFormContent(formContent)
                                onValueChange(formContent)
                            }} className={`${block && "input-block"}`} type="text" placeholder={placeholder} id={String(index)} />
                        </>
                    )
                }
            })}
        </fieldset>
    )
}

export default Form
