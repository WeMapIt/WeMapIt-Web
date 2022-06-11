function Field ({type='text', name, value, step='1', onChange, children}) {
    return (
        <div key={name} className="field">
            <label className="label" htmlFor={name}>{children}</label>
            <input className="input" type={type} name={name} id={name} value={value} step={step} onChange={onChange} />
        </div>
    );
}

function TextArea ({name, value, onChange, children}) {
    return (
        <div key={name} className="field">
            <label className="label" htmlFor={name}>{children}</label>
            <textarea className="input" name={name} id={name} value={value} onChange={onChange} />
        </div>
    );
}

function Submit ({children}) {
    return (
        <div className="primary-button">
            <input className="primary-button" type='submit' value={children} />
        </div>
    );
}

export{Field, TextArea, Submit};