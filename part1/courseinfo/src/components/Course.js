import React from "react";

const Header = ({name}) => (
<>
    <h1>{name}</h1>
</> 
)

const Part = ({part}) => (
    <>
    <p>
        {part.name} {part.exercises}
    </p>
    </>
)

const Content = ({parts}) => (
    <>
    {parts.map(part => <Part key={part.id} part={part} />)}
    </>
)

const Total = ({parts}) => {
    const total = parts.reduce((prev, val) => {
    val.exercises += prev.exercises 
    return val
    })
    return (
    <>
    <b><p>total of {total.exercises} exercises</p></b>
    </>
    )
}

const Course = ({ course }) => {
    return (
    <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
    </div>
    )
}

export default Course