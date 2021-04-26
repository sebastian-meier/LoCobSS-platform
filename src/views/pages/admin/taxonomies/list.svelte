<script lang="ts">
  import LoginCheck from '../../../components/LoginCheck.svelte';
  import Loader from '../../../components/Loader.svelte';
  import {Datatable, rows} from 'svelte-simple-datatables';
  import {taxonomies, load} from '../../../../stores/taxonomies';
  import {link} from 'svelte-spa-router';

  load();

  const tableSettings = {
    sortable: true,
    pagination: true,
    rowPerPage: 10,
    scrollY: false,
    columnFilter: true,
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
        <th class="sortable asc desc" data-key="question">Taxonomy</th>
        <th></th>
      </thead>
      <tbody>
      {#each tRows as row }
          <tr>
              <td>{row.id}</td>
              <td>{row.name}</td>
              <td>
                <a href="/admin/taxonomies/details/{row.id}" use:link>Edit</a>&nbsp;|&nbsp;<a href="/admin/taxonomies/delete/{row.id}">Delete</a>
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