window.reportjs.demo = window.reportjs.demo || {};

window.reportjs.demo.table = {
    dimensions: [
        { id: 'Branch'},
        { id: 'Year' },
        { id: 'Month' }
    ],
    dimensionValues: [
        [
            { id: 'sources' },
            { id: 'master' }
        ],
        [
            { id: '2013' },
            { id: '2014' }
        ],
        [
            { id: 'January' },
            { id: 'February' },
            { id: 'March' },
            { id: 'April' },
            { id: 'May' },
            { id: 'June' },
            { id: 'July' },
            { id: 'August' },
            { id: 'September' },
            { id: 'October' },
            { id: 'November' },
            { id: 'December' }
        ]
    ],
    cells: [
        {value: 12, dimensionValues: [0, 0, 0]},
        {value: 1, dimensionValues: [0, 0, 1]},
        {value: 1, dimensionValues: [0, 0, 2]},
        {value: 2, dimensionValues: [0, 0, 3]},
        {value: 4, dimensionValues: [0, 1, 1]},
        {value: 27, dimensionValues: [0, 1, 2]},
        {value: 12, dimensionValues: [0, 1, 3]},
        {value: 7, dimensionValues: [0, 1, 4]},
        {value: 2, dimensionValues: [0, 1, 7]},

        {value: 8, dimensionValues: [1, 0, 0]},
        {value: 1, dimensionValues: [1, 0, 1]},
        {value: 1, dimensionValues: [1, 0, 3]},
        {value: 2, dimensionValues: [1, 1, 0]},
        {value: 4, dimensionValues: [1, 1, 1]},
        {value: 26, dimensionValues: [1, 1, 2]}
    ]
};
