import { Agent } from 'https';
import React, { useEffect, useState } from 'react';

class Employee {
    name: string;
    age: number;

    constructor (name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    setAge(age: number) {
        this.age = age
    }
}

interface S {
    name: string;
    age: number;
}

function Test() {

    const [emp, setEmp] = useState<S[]>()
    const [inputAge, setInputAge] = useState<number>()

    const emp1 = new Employee('John', 30)
    const emp2 = new Employee('Mike', 31)
    const emps = [emp1, emp2]

    useEffect(() => {
        setEmp(emps)
    }, [])
   
    if (!emp) return <div></div>

    const handleAgeChange = () => {
        emp1.setAge(inputAge!)
        setEmp([...emps])
    }

    return (
        <div style={{margin: '1rem'}}>
            {emp.map(emp => 
            <ul>
                <li>{emp.name}</li>
                <li>{emp.age}</li>
            </ul>
            )}
            <input value={inputAge} onChange={e => setInputAge(+e.target.value)}></input>
            <div>{inputAge}</div>
            <button onClick={handleAgeChange}>SUBMIT</button>
        </div>
            
    );
}

export default Test;