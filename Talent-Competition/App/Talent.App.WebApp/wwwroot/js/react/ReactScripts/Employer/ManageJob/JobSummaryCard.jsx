import React from 'react';
import Cookies from 'js-cookie';
import { Card, Popup, Label, Icon, Button } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.closeJob = this.closeJob.bind(this)
        this.state = {
            isClosed: this.props.job.status === 0 ? false : true
        }
    }

    closeJob() {
        var cookies = Cookies.get('talentAuthToken');
        const httpRequest = new XMLHttpRequest()
        httpRequest.open("POST", "http://localhost:51689/listing/listing/closeJob", true);
        httpRequest.setRequestHeader('Content-Type', 'text/plain')
        httpRequest.setRequestHeader('Authorization', 'Bearer ' + cookies)
        httpRequest.onload = () => {
            const res = JSON.parse(httpRequest.response)
            let data = null;
            if (res.message) {
                data = res.message
                if (res.success) {
                    TalentUtil.notification.show(res.message, "success", null, null);
                    this.setState({ isClosed: true })
                    this.props.handle()
                } else {
                    TalentUtil.notification.show(res.message, "error", null, null);
                }
            }
        }
        httpRequest.onerror = () => {
            const res = JSON.parse(httpRequest.response)
            console.log(httpRequest.status)
            TalentUtil.notification.show(res.message, "error", null, null);
        }
        httpRequest.send(this.props.job.id);
    }

    render() {
        const { job } = this.props
        const { city, country } = job.location
        const isExpired = moment().diff(job.expiryDate, 'minute') > 0
        return (
            <Card fluid className="job-card">
                <Card.Content>
                    <Card.Header>{job.title}</Card.Header>
                    <Label as='a' color='black' ribbon='right'>
                        <Icon name='user' />
                        0
                    </Label>
                    <Card.Meta>{city}, {country}</Card.Meta>
                    <Card.Description className="job-summary">{job.summary}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                    {isExpired ? (<Button color='red' size="tiny" compact active>Expired</Button>) : null}
                    <Button.Group floated='right' color="blue" basic size="tiny" compact>
                        <Button onClick={this.closeJob} disabled={this.state.isClosed}><Icon name='ban' />
                            {this.state.isClosed ? "Closed" : "Close"}
                        </Button>
                        <Button><Icon name='edit outline' />Edit</Button>
                        <Button><Icon name='copy outline' />Copy</Button>
                    </Button.Group>
                </Card.Content>
            </Card>
        )
    }
}