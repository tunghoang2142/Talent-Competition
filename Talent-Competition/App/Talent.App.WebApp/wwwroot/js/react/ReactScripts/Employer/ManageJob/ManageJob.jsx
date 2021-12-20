import React, { useReducer } from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Grid, Container, Header } from 'semantic-ui-react';
import { filter } from 'draft-js/lib/DefaultDraftBlockRenderMap';

const SortByDate = {
    desc: "Oldest first",
    asc: "Newest first"
}

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true,
            },
            totalPages: 1,
            limit: 6,
            activeIndex: "",
            filterOpen: false,
            sortByDate: SortByDate.asc

        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.updateData = this.updateData.bind(this)
        this.handleFilterStateChange = this.handleFilterStateChange.bind(this)
        this.handleFilterOpen = this.handleFilterOpen.bind(this)
        this.handleFilterClose = this.handleFilterClose.bind(this)
        this.updateFilter = this.updateFilter.bind(this)
        this.handleDateSortUpdate = this.handleDateSortUpdate.bind(this)
        this.handlePageChange = this.handlePageChange.bind(this)
        this.handleCloseJob = this.handleCloseJob.bind(this)
    };

    init() {
        this.loadData()
    }

    componentDidMount() {
        this.init();
    };

    loadData() {
        var cookies = Cookies.get('talentAuthToken');
        const httpRequest = new XMLHttpRequest()
        var url = "http://localhost:51689/listing/listing/getSortedEmployerJobs?"
        for (const key in this.state.filter) {
            url += `${key}=${this.state.filter[key]}&`
        }
        switch (this.state.sortByDate) {
            case SortByDate.asc: url += `sortbyDate=asc&`; break
            case SortByDate.desc: url += `sortbyDate=desc&`; break
            default:
        }
        url += `limit=${this.state.limit}&`
        url += `activePage=${this.state.activePage}`

        httpRequest.open("GET", url, true);
        httpRequest.setRequestHeader('Authorization', 'Bearer ' + cookies)
        httpRequest.setRequestHeader('Content-Type', 'application/json')
        httpRequest.onload = () => {
            const res = JSON.parse(httpRequest.response)
            let data = null;
            let totalCount = 0;
            if (res.myJobs) {
                data = res.myJobs
                totalCount = res.totalCount
            }
            this.updateData(data, totalCount)
        }
        httpRequest.onerror = () => {
            const res = JSON.parse(httpRequest.response)
            console.log(httpRequest.status)
        }
        httpRequest.send();
    }

    updateData(newData, totalCount) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        let totalPages = Math.ceil(totalCount / this.state.limit)
        if (totalPages < 1) totalPages = 1
        this.setState({
            loadJobs: [...newData],
            loaderData: loader,
            totalPages: totalPages
        }, () => {
            loader.isLoading = false;
            this.setState({
                loaderData: loader
            })
        })
    }

    handleCloseJob() {
        if (this.state.filter.showClosed) {
            return
        }
        if (this.state.loadJobs.length < 2) {
            let activePage = this.state.activePage - 1
            if (activePage < 1) activePage = 1
            this.handlePageChange(undefined, { activePage: activePage })
            return
        }
        this.handlePageChange(undefined, { activePage: this.state.activePage })
    }

    handleDateSortUpdate() {
        if (this.state.sortByDate === SortByDate.desc) {
            this.setState({ sortByDate: SortByDate.asc }, () => this.loadData())
        } else {
            this.setState({ sortByDate: SortByDate.desc }, () => this.loadData())
        }
    }

    updateFilter(newFilter) {
        let filter = Object.assign({}, this.state.filter)
        this.setState({
            filter: Object.assign(filter, newFilter)
        }, () => {
            this.loadData()
            this.handlePageChange(undefined, { activePage: 1 })
        })
    }

    handleFilterStateChange() {
        if (!this.state.filterOpen) {
            this.handleFilterOpen()
        } else {
            this.handleFilterClose()
        }
    }

    handleFilterOpen() {
        // console.log("open")
        this.setState({ filterOpen: true })
    }

    handleFilterClose() {
        // console.log("close")
        this.setState({ filterOpen: false })
    }

    handlePageChange(_, { activePage }) {
        this.setState({ activePage: activePage }, () => this.loadData())
    }

    render() {
        const data = this.state.loadJobs
        const { filter, activePage, totalPages } = this.state;
        // console.log(this.state.loaderData)
        // console.log(data)
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <Header as='h1'>List of Job</Header>
                    <Icon name='filter'></Icon>Filter:&nbsp;
                    {/* Dropdown events are bugged */}
                    <Dropdown text='Choose filter' icon='caret down'
                        // onChange={() => { console.log("A") }}
                        // onClick={() => { console.log("B") }}
                        onClick={() => {
                            this.handleFilterStateChange()
                            // console.log("Label clicked")
                        }}
                        // onFocus={() => { console.log("C") }}
                        // onFocus={() => { this.handlingFilterStateChange(); console.log("Label focus") }}
                        // onBlur={() => { console.log("D") }}
                        // onBlur={() => { this.handlingFilterClose(); console.log("Label blur") }}
                        // onLabelClick={() => { console.log("E") }}
                        open={false}
                        closeOnBlur={false}
                        closeOnChange={false}
                        openOnFocus={false}
                    >
                        <Dropdown.Menu
                            open={this.state.filterOpen}
                            // onFocus={() => {
                            //     this.filterOpenHandling()
                            //     // console.log("Menu focus")
                            // }}
                            onClick={() => {
                                this.handleFilterOpen()
                                // console.log("Menu clicked")
                            }}
                            onBlur={() => {
                                this.handleFilterClose()
                                // console.log("Menu blur")
                            }}
                        >
                            {
                                Object.entries(filter).map(([key, value]) => {
                                    return (
                                        <Dropdown.Item key={key}>
                                            <Checkbox label={key} checked={value}
                                                onChange={(_, { checked }) => {
                                                    const newFilter = Object.fromEntries([[key, checked]])
                                                    this.updateFilter(newFilter)
                                                }} />
                                        </Dropdown.Item>
                                    )
                                })
                            }
                        </Dropdown.Menu>
                    </Dropdown>

                    <Icon name='calendar alternate outline'></Icon>Sort by date:&nbsp;
                    <Dropdown text={this.state.sortByDate} icon='caret down'
                        onClick={this.handleDateSortUpdate}
                    >
                    </Dropdown>

                    <Grid columns='3' padded='vertically'>
                        <Grid.Row stretched>
                            {data.map((element) => {
                                return (
                                    <Grid.Column key={element.id}><JobSummaryCard job={element} handle={this.handleCloseJob}></JobSummaryCard></Grid.Column>
                                )
                            })}
                        </Grid.Row>
                    </Grid>
                    <Segment className='job-manage' basic textAlign={"center"}>
                        <Pagination
                            activePage={activePage}
                            boundaryRange={1}
                            onPageChange={this.handlePageChange}
                            size='mini'
                            siblingRange={2}
                            totalPages={totalPages}
                            ellipsisItem={undefined}
                            firstItem={undefined}
                            lastItem={undefined}
                            prevItem={undefined}
                            nextItem={undefined}
                        />
                    </Segment>
                </div>
            </BodyWrapper >
        )
    }
}