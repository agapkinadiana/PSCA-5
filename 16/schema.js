const {
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLSchema
} = require('graphql');
const Db = require('./db/Db');

async function getRecordsByField(object, field) {
    const fieldsMap = new Map();
    fieldsMap.set(object + '_Id', field);

    let records = [];
    if (field) {
        records = await db.getOne(object, fieldsMap);
    } else {
        records = await db.getAll(object);
    }
    return records;
}
async function mutateRecord(object, idField, fields) {
    // If id specified then we can use only it to search the record, if it isn't then it doesn't matter
    return await db.getOne(object, idField ? idField : fields)
        .then(async records => {
            let targetRecord = {};
            // If the record exists
            if (records.length > 0) {
                // Then update it and return updated variant
                targetRecord = await db.updateOne(object, fields)
                    .then(() => db.getOne(object, fields));
            } else {
                // delete id field from fields object
                delete fields[Object.keys(fields).find(field => fields[field] === idField)];
                //delete fields.Faculty_Id;
                // If there no, insert new one and return it
                targetRecord = await db.insertOne(object, fields)
                    .then(() => db.getOne(object, fields));
            }
            return targetRecord[0];
        });
}
async function deleteRecord(object, id) {
    let recordIdObject = {};
    recordIdObject[object + '_Id'] = id;
    let targetFaculty = await db.getOne(object, recordIdObject);
    db.deleteOne(object, id);
    return targetFaculty[0];
}

const db = new Db();

const FacultyType = new GraphQLObjectType({
    name: 'Faculty',
    description: 'Faculty table',
    fields: () => ({
        Faculty_Id: {type: new GraphQLNonNull(GraphQLInt)},
        Faculty_Name: {type: new GraphQLNonNull(GraphQLString)}
    })
});
const PulpitType = new GraphQLObjectType({
    name: 'Pulpit',
    description: 'Pulpit table',
    fields: () => ({
        Pulpit_Id: {type: new GraphQLNonNull(GraphQLInt)},
        Pulpit_Name: {type: new GraphQLNonNull(GraphQLString)},
        Faculty: {type: GraphQLInt}
    })
});
const SubjectType = new GraphQLObjectType({
    name: 'Subject',
    description: 'Subject table',
    fields: () => ({
        Subject_Id: {type: new GraphQLNonNull(GraphQLInt)},
        Subject_Name: {type: new GraphQLNonNull(GraphQLString)},
        Pulpit: {type: GraphQLInt}
    })
});
const TeacherType = new GraphQLObjectType({
    name: 'Teacher',
    description: 'Teacher table',
    fields: () => ({
        Teacher_Id: {type: new GraphQLNonNull(GraphQLInt)},
        Teacher_Name: {type: new GraphQLNonNull(GraphQLString)},
        Pulpit: {type: GraphQLInt},
    })
});
const AuditoriumTypeType = new GraphQLObjectType({
    name: 'AuditoriumType',
    description: 'Auditorium Type table',
    fields: () => ({
        Auditorium_Id: {type: new GraphQLNonNull(GraphQLInt)},
        Auditorium_Name: {type: new GraphQLNonNull(GraphQLString)},
        Auditorium_Capacity: {type: GraphQLInt},
        Auditorium_Type: {type: GraphQLInt},
    })
});
const AuditoriumType = new GraphQLObjectType({
    name: 'Auditorium',
    description: 'Auditorium table',
    fields: () => ({
        Auditorium_Type_Id: {type: new GraphQLNonNull(GraphQLInt)},
        Auditorium_Type_Name: {type: new GraphQLNonNull(GraphQLString)}
    })
});

const UniversityRootType = new GraphQLObjectType({
    name: 'UniversityRoot',
    description: 'University Schema Query Root',
    fields: {
        getFaculties: {
            args: {
                faculty: {type: GraphQLInt}
            },
            type: new GraphQLList(FacultyType),
            description: "List of all faculties",
            resolve: (root, args) => getRecordsByField('Faculty', args.faculty)
        },
        getPulpits: {
            args: {
                pulpit: {type: GraphQLInt}
            },
            type: new GraphQLList(PulpitType),
            description: "List of all pulpits",
            resolve: (root, args) => getRecordsByField('Pulpit', args.pulpit)
        },
        getSubjects: {
            args: {
                subject: {type: GraphQLInt},
                faculty: {type: GraphQLInt}
            },
            type: new GraphQLList(SubjectType),
            description: "List of all subjects",
            resolve: async (root, args) => {
                const {subject, faculty} = args;
                return faculty ?
                    await db.query(
                        `SELECT * FROM Subject s
                                JOIN Pulpit p ON s.Pulpit = p.Pulpit_Id 
                                JOIN Faculty f ON p.Faculty = f.Faculty_Id
                                WHERE p.Faculty = ${faculty};`
                    ) :
                    await getRecordsByField('Subject', subject);
            }
        },
        getTeachers: {
            args: {
                teacher: {type: GraphQLInt},
                faculty: {type: GraphQLInt}
            },
            type: new GraphQLList(TeacherType),
            description: "List of all teachers",
            resolve: async (root, args) => {
                const {teacher, faculty} = args;
                return faculty ?
                    await db.query(
                        `SELECT * FROM Teacher t 
                                JOIN Pulpit p ON t.Pulpit = p.Pulpit_Id 
                                JOIN Faculty f ON p.Faculty = f.Faculty_Id
                                WHERE p.Faculty = ${faculty};`
                    ) :
                    await getRecordsByField('Teacher', teacher);
            }
        },
        getAuditoriumTypes: {
            type: new GraphQLList(AuditoriumTypeType),
            description: "List of all auditorium types",
            resolve: async () => {
                return await db.getAll('Auditorium_Type');
            }
        },
        getAuditoriums: {
            type: new GraphQLList(AuditoriumType),
            description: "List of all auditoriums",
            resolve: async () => {
                return await db.getAll('Auditorium');
            }
        },
    }
});
const UniversityMutationRootType = new GraphQLObjectType({
    name: 'UniversityMutationRoot',
    description: 'University Mutation Schema Query Root',
    fields: {
        setFaculty: {
            type: FacultyType,
            args: {
                facultyId: {type: GraphQLInt},
                facultyName: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: (root, args) => {
                let fields = {Faculty_Id: args.facultyId, Faculty_Name: args.facultyName};
                return mutateRecord('Faculty', fields.Faculty_Id, fields);
            }
        },
        setPulpit: {
            type: PulpitType,
            args: {
                pulpitId: {type: GraphQLInt},
                pulpitName: {type: new GraphQLNonNull(GraphQLString)},
                facultyId: {type: GraphQLInt}
            },
            resolve: async (root, args) => {
                let fields = {Pulpit_Id: args.pulpitId, Pulpit_Name: args.pulpitName, Faculty: args.facultyId};
                return mutateRecord('Pulpit', fields.Pulpit_Id, fields);
            }
        },
        setSubject: {
            type: SubjectType,
            args: {
                subjectId: {type: GraphQLInt},
                subjectName: {type: new GraphQLNonNull(GraphQLString)},
                pulpitId: {type: GraphQLInt}
            },
            resolve: async (root, args) => {
                let fields = {Subject_Id: args.subjectId, Subject_Name: args.subjectName, Pulpit: args.pulpitId};
                return mutateRecord('Subject', fields.Subject_Id, fields);
            }
        },
        setTeacher: {
            type: TeacherType,
            args: {
                teacherId: {type: GraphQLInt},
                teacherName: {type: new GraphQLNonNull(GraphQLString)},
                pulpitId: {type: GraphQLInt}
            },
            resolve: async (root, args) => {
                let fields = {Teacher_Id: args.teacherId, Teacher_Name: args.teacherName, Pulpit: args.pulpitId};
                return mutateRecord('Teacher', fields.Teacher_Id, fields);
            }
        },

        delFaculty: {
            type: FacultyType,
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (root, args) => deleteRecord('Faculty', args.id)
        },
        delPulpit: {
            type: PulpitType,
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (root, args) => deleteRecord('Pulpit', args.id)
        },
        delSubject: {
            type: SubjectType,
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (root, args) => deleteRecord('Subject', args.id)
        },
        delTeacher: {
            type: TeacherType,
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (root, args) => deleteRecord('Teacher', args.id)
        }
    }
});

const UniversitySchema = new GraphQLSchema({
    query: UniversityRootType,
    mutation: UniversityMutationRootType
});

module.exports = UniversitySchema;
