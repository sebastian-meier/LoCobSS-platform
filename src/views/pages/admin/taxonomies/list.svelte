<script lang="ts">
  import LoginCheck from '../../../components/LoginCheck.svelte';
  import Loader from '../../../components/Loader.svelte';
  import {Datatable, rows} from 'svelte-simple-datatables';
  import {taxonomies, load} from '../../../../stores/taxonomies';
  import {link} from 'svelte-spa-router';
  import {_} from 'svelte-i18n';

  load();

  const tableSettings = {
    sortable: true,
    pagination: true,
    rowPerPage: 10,
    scrollY: false,
    columnFilter: true,
    labels: {
        search: $_('search'),    // search input placeholer
        filter: $_('filter'),       // filter inputs placeholder
        noRows: $_('no_entries'),
        info: $_('datatable_meta'),
        previous: $_('previous'),
        next: $_('next'),       
    }
  };

  let tRows: { id: number, name: string}[] = [];
  $: tRows = $rows;

</script>
<LoginCheck>
  {#if $taxonomies}
  {#await $taxonomies}
  <Loader />
  {:then data} 
  {#if data.length > 0}
  <div class="datatable-question">
    <Datatable settings={tableSettings} data={data}>
      <thead>
        <th class="sortable asc desc" data-key="id">ID</th>
        <th class="sortable asc desc" data-key="question">{$_('taxonomies')}</th>
        <th></th>
      </thead>
      <tbody>
      {#each tRows as row }
          <tr>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>
                <ul class="action-list">
                  <li><a href="/admin/taxonomies/details/{row.id}" use:link><span class="icon edit">Edit</span></a></li>
                  <li><a href="/admin/taxonomies/delete/{row.id}" use:link><span class="icon delete">Delete</span></a></li>
                </ul>
              </td>
          </tr>
      {/each}
      </tbody>
    </Datatable>
  </div>
  {/if}
  {/await}
  {/if}
</LoginCheck>