import * as React from 'react'
import TextField from '@material-ui/core/TextField';

interface eleCon
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'webkitdirectory' | 'size' | 'prefix' | 'type'> {
    header?: string,
    placeholder?: string,
    id: string,
    block?: boolean,
    type?: 'input' | 'switch',
}

const Form = ({ config, onValueChange, defaultValue = {}, ...props }: {
    config: eleCon[],
    focus?: number,
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
                switch (type) {
                    case 'switch': return (
                        <React.Fragment key={id}>
                            <label className="paper-switch">
                                <input {...props} type="checkbox" />
                                <span className="paper-switch-slider"></span>
                            </label>
                            {header && <label data-for="paperSwitch4" className="paper-switch-label">
                                {header}
                            </label>}
                        </React.Fragment>
                    )
                    default: return (
                        <TextField id="standard-basic" label="Standard" />
                    )
                }
            })}
        </fieldset>
    )
}

export default Form
