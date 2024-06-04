export const LetterOnly = (event) => {
    let char = String.fromCharCode(event.keyCode);
    if(/^[A-Za-z]+$/.test(char)) return true; 
    return event.preventDefault(); 
};

export const NumberOnly = (event) => {
    let char = String.fromCharCode(event.keyCode);
    if(/^\d+$/.test(char)) return true; 
    return event.preventDefault(); 
};

export const NumberWithDash = (event) => {
    let char = String.fromCharCode(event.keyCode);
    if(/^[0-9-]+$/.test(char)) return true; 
    return event.preventDefault(); 
};