export interface JiraIssue {
    id: string;
    key: string;
    fields: {
        summary: string;
        issuetype: {
            name: string;
        };
        status: {
            name: string;
        };
        assignee: {
            displayName: string;
        };
        duedate: string;
        resolutiondate: string;
        timetracking: {
            timeSpent: string;
        };
        created: string;
        updated: string;
        parent: {
            id: string;
            key: string;
            fields: {
                summary: string;
                status: {
                    name: string;
                };
                issuetype: {
                    name: string;
                };
            };
        };
    };
}

export interface MappedJiraIssue {
    id: string;
    key: string;
    name: string;
    type: string;
    status: string;
    assignee: string;
    due_date: string;
    resolution_date: string;
    time_spent: string;
    created_at: string;
    last_update: string;
    parent: {
        id: string;
        key: string;
        name: string;
        type: string;
        status: string;
    };
}

export interface MappedJiraEpic {
    id: string;
    key: string;
    name: string;
    type: string;
    status: string;
    tasks: MappedJiraTask[];
}

export interface MappedJiraTask {
    id: string;
    key: string;
    name: string;
    type: string;
    status: string;
    assignee: string;
    due_date: string;
    resolution_date: string;
    time_spent: string;
    created_at: string;
    last_update: string;
    subtasks: MappedJiraSubtask[];
}

export interface MappedJiraSubtask {
    id: string;
    key: string;
    name: string;
    type: string;
    status: string;
    assignee: string;
    due_date: string;
    resolution_date: string;
    time_spent: string;
    created_at: string;
    last_update: string;
}

export interface JiraIssueTree {
    epics: MappedJiraEpic[];
}

export interface GetProjectsResult {
    id: string;
    key: string;
    name: string;
}

export interface GetIssuesResult {
    issues: JiraIssue[];
}