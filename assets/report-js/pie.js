window.reportjs.demo = window.reportjs.demo || {};

window.reportjs.demo.pie = {
    dimensions: [
        { id: 'Branch'}
    ],
    dimensionValues: [
        [
            { id: 'sources' },
            { id: 'master' }
        ]
    ],
    cells: [
        {value: 68, dimensionValues: [0]},
        {value: 42, dimensionValues: [1]}
    ]
};
