<script lang="ts">
  import LoginCheck from '../../../components/LoginCheck.svelte';
  import Loader from '../../../components/Loader.svelte';
  import {loggedIn} from '../../../../stores/current_user';
  import {Datatable, rows} from 'svelte-simple-datatables';
  import {questions, load} from '../../../../stores/questions';
  import {link} from 'svelte-spa-router';

  let data: { id: number, question: string}[] = [];

  $: if ($loggedIn) {
    load();
  }

  const tableSettings = {
    sortable: true,
    pagination: true,
    rowPerPage: 10,
    scrollY: false,
    columnFilter: true,
  };

  let tRows: { id: number, question_de: string}[] = [];
  $: tRows = $rows;

</script>
<LoginCheck>
  {#if $questions}
  {#await $questions}
  <Loader />
  {:then data} 
  {#if data.length > 0}
  <div class="datatable-question">
    <Datatable settings={tableSettings} data={data}>
      <thead>
        <th class="sortable asc desc" data-key="id">ID</th>
        <th class="sortable asc desc" data-key="question">Question</th>
        <th></th>
      </thead>
      <tbody>
      {#each tRows as row }
          <tr>
              <td>{row.id}</td>
              <td>{row.question_de}</td>
              <td>
                <a href="/admin/questions/details/{row.id}" use:link>Edit</a>&nbsp;|&nbsp;<a href="/admin/questions/cluster/{row.id}" use:link>Cluster</a>
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