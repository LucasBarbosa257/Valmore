interface JiraConfig {
    endpoint: string;
    params?: string;
}

export class JiraClient {
    constructor(
        private readonly host: string,
        private readonly userEmail: string,
        private readonly apiToken: string
    ) { }

    public async fetch(
        data: JiraConfig
    ): Promise<any> {
        const url = `https://${this.host}.atlassian.net/rest/api/3/${data.endpoint}?${data.params}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${Buffer.from(
                    `${this.userEmail}:${this.apiToken}`
                ).toString('base64')}`,
                'Accept': 'application/json'
            }
        });


        const text = await response.text();

        if (!response.ok) {
            throw new Error(
                `Jira API error (${response.status}): ${text}`,
            );
        }

        return text ? JSON.parse(text) : null;
    }
}