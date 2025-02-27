// Copyright (C) 2012-2022 Zammad Foundation, https://zammad-foundation.org/

import { visitView } from '@tests/support/components/visitView'
import {
  mockGraphQLApi,
  mockGraphQLSubscription,
} from '@tests/support/mock-graphql-api'
import { mockPermissions } from '@tests/support/mock-permissions'
import { waitUntil } from '@tests/support/utils'
import { OrganizationDocument } from '../graphql/queries/organization.api'
import { OrganizationUpdatesDocument } from '../graphql/subscriptions/organizationUpdates.api'
import {
  defaultOrganization,
  mockOrganizationObjectAttributes,
} from './mocks/organization-mocks'

describe('static organization', () => {
  it('shows organization', async () => {
    mockPermissions(['admin.organization'])

    const organization = defaultOrganization()
    const mockApi = mockGraphQLApi(OrganizationDocument).willResolve({
      organization,
    })
    const mockSubscription = mockGraphQLSubscription(
      OrganizationUpdatesDocument,
    )
    mockOrganizationObjectAttributes()

    const view = await visitView('/organizations/1vs2dr3041dsa9')

    await waitUntil(() => mockApi.calls.resolve)

    expect(view.getByText(organization.name)).toBeInTheDocument()

    expect(
      view.getByRole('region', { name: 'Shared organization' }),
    ).toHaveTextContent('no')
    expect(
      view.getByRole('region', { name: 'Domain based assignment' }),
    ).toHaveTextContent('yes')

    expect(view.container).toHaveTextContent('Tickets')

    const openTickets = view.getByRole('link', { name: 'open 3' })
    const closedTickets = view.getByRole('link', { name: 'closed 1' })

    expect(openTickets).toHaveAttribute(
      'href',
      '/search/ticket?state=open&organization_id=1vs2dr3041dsa9',
    )
    expect(closedTickets).toHaveAttribute(
      'href',
      '/search/ticket?state=closed&organization_id=1vs2dr3041dsa9',
    )

    await mockSubscription.next({
      data: {
        organizationUpdates: {
          __typename: 'OrganizationUpdatesPayload',
          organization: {
            ...organization,
            name: 'Updated Organization',
          },
        },
      },
    })

    expect(view.getByText('Updated Organization')).toBeInTheDocument()
  })

  it('shows organization members', async () => {
    mockPermissions(['admin.organization'])

    const organization = defaultOrganization()
    const mockApi = mockGraphQLApi(OrganizationDocument).willResolve({
      organization: {
        ...organization,
        members: {
          ...organization.members,
          totalCount: 2,
        },
      },
    })
    mockGraphQLSubscription(OrganizationUpdatesDocument)
    mockOrganizationObjectAttributes()

    const view = await visitView('/organizations/1vs2dr3041dsa9')

    await waitUntil(() => mockApi.calls.resolve)

    expect(view.container).toHaveTextContent('Members')

    const members = organization.members.edges

    expect(members).toHaveLength(1)
    expect(view.container).toHaveTextContent(members[0].node.fullname!)

    mockApi.spies.resolve.mockResolvedValue({
      data: {
        organization: {
          ...organization,
          members: {
            ...organization.members,
            edges: [
              ...members,
              {
                __typename: 'UserEdge',
                node: {
                  __typename: 'User',
                  id: 'dsa214dascxasdw',
                  internalId: 2,
                  firstname: 'Jane',
                  lastname: 'Hunter',
                  fullname: 'Jane Hunter',
                  image: null,
                },
              },
            ],
          },
        },
      },
    })

    await view.events.click(view.getByRole('button', { name: 'Show 1 more' }))
    await waitUntil(() => mockApi.calls.resolve > 1)

    expect(view.container).toHaveTextContent('Jane Hunter')
  })
})
