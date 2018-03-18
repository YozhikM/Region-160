/* @flow */

import * as React from 'react';
import { type RouterHistory, type Match, type Location } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import 'papercss/dist/paper.min.css';
import JobItem from './JobItem';
import Pagination from './Pagination';
import Select from './Select';
import SearchForm from './SearchForm';
import { citiesOptions, sortOptions } from './options';

type Props = {|
  history: RouterHistory,
  match: Match,
  location: Location,
  data: ?Object,
|};

type State = {
  page: string,
  pages?: number,
  perPage?: number,
  count?: number,
};

class Page extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { history, match } = this.props;
    const { params } = match || {};
    const { page } = params || {};

    this.onChange = debounce(this.onChange, 600);

    if (page) {
      this.state = {
        page,
      };
    } else {
      history.push('160-1');
      this.state = {
        page: '160-1',
      };
    }
  }

  static fragments = {
    job: gql`
      fragment JobItem on Job {
        _id
        id
        name
        description
        salary {
          from
          to
          currency
          gross
        }
        snippet {
          responsibility
          requirement
        }
        created_at
        published_at
        employer {
          name
          alternate_url
        }
        address {
          city
          metro {
            station_name
          }
        }
      }
    `,
  };

  componentWillReceiveProps(nextProps: Props) {
    const { data, match } = nextProps || {};
    const { jobPagination } = data || {};
    const { count, pageInfo } = jobPagination || {};
    const { pageCount } = pageInfo || {};
    const { params } = match || {};
    const { page } = params || {};

    if (pageCount && count && page) {
      this.setState({ pages: pageCount, count, page });
    } else if (!pageCount && !count) {
      this.setState({ pages: 0, count: 0 });
    }
    if (document.body) document.body.scrollTop = 0;
  }

  initializeArray = (start: number = 1, step: number = 1): Array<number> => {
    const { pages = 1 } = this.state;
    return Array.from({ length: Math.ceil((pages - start) / step + 1) }).map(
      (v, i) => i * step + start
    );
  };

  onSelect = (value: string) => {
    const { history, location } = this.props;
    const query = location.search;

    history.replace(`${value}-1${query}`);
    if (document.body) document.body.scrollTop = 0;
  };

  onChange = (value: string) => {
    const { location, history } = this.props;
    const query = new URLSearchParams(location.search);
    if (!query.has('q')) {
      query.append('q', value);
    } else {
      query.set('q', value);
    }
    history.push({ pathname: location.pathname, search: query.toString() });
  };

  onChangeSort = (value: string) => {
    const { location, history } = this.props;
    const query = new URLSearchParams(location.search);
    if (!query.has('sort')) {
      query.append('sort', value);
    } else {
      query.set('sort', value);
    }
    history.push({ pathname: location.pathname, search: query.toString() });
  };

  render() {
    const { data, location } = this.props;
    const { jobPagination } = data || {};
    const { items } = jobPagination || {};
    const { count, page } = this.state;
    const city = page.replace(/-\d+/gi, '');
    const pagesArray = this.initializeArray();
    const query = new URLSearchParams(location.search);
    if (!items) return null;

    return (
      <div>
        <div className="row flex-center">
          <Select
            name="Cities"
            value={city.replace(/-\d/gi, '')}
            options={citiesOptions}
            onSelect={this.onSelect}
          />
          <Select
            name="Sorting"
            value={query.get('sort')}
            options={sortOptions}
            onSelect={this.onChangeSort}
          />
        </div>

        <SearchForm onChange={this.onChange} value={query.get('q')} />

        {count && (
          <div className="row flex-center">
            <span className="badge">{`${count} jobs`}</span>
          </div>
        )}

        <div className="row">
          {items &&
            items.map(job => {
              if (!job) return null;
              const { id } = job || {};
              return <JobItem key={id} job={job} />;
            })}
        </div>
        <div className="row flex-center align-bottom">
          <Pagination pagesArray={pagesArray} city={city} query={query.toString()} />
        </div>
      </div>
    );
  }
}

const PageQuery = gql`
  query PageQuery(
    $page: Int
    $perPage: Int
    $filter: FilterFindManyJobInput
    $sort: SortFindManyJobInput
  ) {
    jobPagination(page: $page, perPage: $perPage, filter: $filter, sort: $sort) {
      pageInfo {
        pageCount
        hasNextPage
        currentPage
        hasPreviousPage
        perPage
      }
      count
      items {
        ...JobItem
      }
    }
  }
  ${Page.fragments.job}
`;

const options = ({ match, location }: Props): { variables: Object } => {
  const { params } = match || {};
  const { page } = params || {};
  let area;
  let pageNumber;
  const query = new URLSearchParams(location.search);
  if (!page) {
    area = '160';
    pageNumber = 1;
  } else if (page) {
    [area, pageNumber] = page.match(/\d+/gi);
  }

  let filter;
  if (query.has('q')) {
    filter = { q: query.get('q'), area };
  } else {
    filter = { area };
  }

  let sort;
  if (query.has('sort')) {
    sort = query.get('sort');
  } else {
    sort = 'PUBLISHED_AT_DESC';
  }

  return { variables: { page: Number(pageNumber), filter, perPage: 9, sort } };
};

export default graphql(PageQuery, { options })(Page);
